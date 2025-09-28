import os
from google.adk.agents import LlmAgent, ParallelAgent, LoopAgent
from typing import Dict, Any, List, Tuple, Union
from google.adk.planners import BuiltInPlanner
from google.genai.types import ThinkingConfig
from clients import query_bigquery_context, send_patient_sms

gcp_project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
dataset_id = os.getenv('BQ_DATASET_ID')

INVENTORY_COLUMN_TYPES = {
    "id": "STRING",
    "name": "STRING",
    "genericName": "STRING",
    "ndc": "STRING",
    "currentStock": "INTEGER",
    "minThreshold": "INTEGER",
    "maxStock": "INTEGER",
    "lastReorder": "DATE",
    "needsReorder": "BOOLEAN",
    "supplier": "STRING",
    "costPerUnit": "NUMERIC",
    "expirationDate": "DATE",
    "lotNumber": "STRING",
    "location": "STRING",
    "created_at": "TIMESTAMP",
    "updated_at": "TIMESTAMP",
}

PRESCRIPTIONS_COLUMN_TYPES = {
    "id": "STRING",
    "patientId": "STRING",
    "patientName": "STRING",
    "medication": "STRING",
    "dosage": "STRING",
    "quantity": "INTEGER",
    "status": "STRING",           # e.g., "pending", "filled", "blocked"
    "prescribedBy": "STRING",
    "dateCreated": "TIMESTAMP",
    "dateFilled": "TIMESTAMP",
    "agentId": "STRING",
    "insuranceStatus": "STRING",  # e.g., "approved", "denied", "pending"
    "priority": "STRING",         # e.g., "normal", "high"
    "estimatedCompletion": "TIMESTAMP",
    "copayAmount": "NUMERIC",
    "refillsRemaining": "INTEGER",
    "instructions": "STRING",
    "warnings": "STRING",
    "created_at": "TIMESTAMP",
    "updated_at": "TIMESTAMP",
}

USERS_COLUMN_TYPES = {
    "id": "STRING",
    "name": "STRING",
    "role": "STRING",
    "email": "STRING",
    "phone": "STRING",
    "DateOfBirth": "DATE",
    "created_at": "TIMESTAMP",
    "updated_at": "TIMESTAMP",
}

def format_value(field_map: Dict[str, str], col: str, val: Any) -> str:
    col_type = field_map.get(col)

    if val is None:
        return "NULL"

    if col_type in ("STRING"):
        return f"'{val}'"
    elif col_type == "DATE":
        return f"DATE '{val}'"
    elif col_type == "TIMESTAMP":
        return f"TIMESTAMP '{val}'"
    elif col_type == "BOOLEAN":
        return "TRUE" if val else "FALSE"
    else:  # INTEGER, NUMERIC
        return str(val)
    

def get_prescriptions(filters: Dict[str, Any], limit: int = 50) -> List[dict]:
    """
    Fetch prescriptions from BigQuery with optional filters.

    Filters must use field names from the prescriptions schema:

    Prescriptions Table Schema:
    - id (STRING)
    - patientId (STRING)
    - patientName (STRING)
    - medication (STRING)
    - dosage (STRING)
    - quantity (INTEGER)
    - status (STRING)  # e.g., "pending", "filled", "blocked"
    - prescribedBy (STRING)
    - dateCreated (TIMESTAMP)
    - dateFilled (TIMESTAMP)
    - agentId (STRING)
    - insuranceStatus (STRING)  # e.g., "approved", "denied", "pending"
    - priority (STRING)  # e.g., "normal", "high"
    - estimatedCompletion (TIMESTAMP)
    - copayAmount (NUMERIC(10,2))
    - refillsRemaining (INTEGER)
    - instructions (STRING)
    - warnings (STRING)
    - created_at (TIMESTAMP)
    - updated_at (TIMESTAMP)

    Args:
        filters: dict mapping column names to filter values (e.g., {"patientName": "Alice Rivera", "status": "filled"}).
        limit: maximum number of rows to return.

    Returns:
        List of prescription dicts (JSON-serializable).
    """
    where_clauses = []
    for col, val in filters.items():
        if isinstance(val, (tuple, list)) and len(val) == 2:
            op, v = val
        else:
            op, v = "=", val

        if v is None:
            if op in ("=", "IS"):
                where_clauses.append(f"{col} IS NULL")
            elif op in ("!=", "<>", "IS NOT"):
                where_clauses.append(f"{col} IS NOT NULL")
        else:
            where_clauses.append(f"{col} {op} {format_value(PRESCRIPTIONS_COLUMN_TYPES, col, v)}")

    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

    sql = f"""
        SELECT *
        FROM `{gcp_project_id}.{dataset_id}.Prescriptions`
        {where_sql}
        LIMIT {limit}
    """
    raw = query_bigquery_context(sql)
    print(f"raw: {raw}")
    import json
    try:
        rows = json.loads(raw)
        return rows[0] if rows else {}
    except Exception:
        return {}

def get_users(filters: Dict[str, Any], limit: int = 50) -> List[dict]:
    """
    Fetch users from BigQuery with optional filters.

    Filters must use field names from the prescriptions schema:

    Users Table Schema:
    - id (STRING)
    - name (STRING)
    - role (STRING)
    - email (STRING)
    - phone (STRING)
    - DateOfBirth (DATE)
    - created_at (TIMESTAMP)
    - updated_at (TIMESTAMP)

    Args:
        filters: dict mapping column names to filter values
                 Examples:
                    {"role": "pharmacist"}
                    {"DateOfBirth": (">", "1990-01-01")}
        limit: maximum number of rows to return.

    Returns:
        List of user dicts (JSON-serializable).
    """
    where_clauses = []
    for col, val in filters.items():
        if isinstance(val, (tuple, list)) and len(val) == 2:
            op, v = val
        else:
            op, v = "=", val

        if v is None:
            if op in ("=", "IS"):
                where_clauses.append(f"{col} IS NULL")
            elif op in ("!=", "<>", "IS NOT"):
                where_clauses.append(f"{col} IS NOT NULL")
        else:
            where_clauses.append(f"{col} {op} {format_value(USERS_COLUMN_TYPES, col, v)}")

    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""

    sql = f"""
        SELECT *
        FROM `{gcp_project_id}.{dataset_id}.Users`
        {where_sql}
        LIMIT {limit}
    """
    raw = query_bigquery_context(sql)
    print(f"raw: {raw}")
    import json
    try:
        rows = json.loads(raw)
        return rows if isinstance(rows, list) else []
    except Exception:
        return []

def notify_patient(message: str, patient_info: Dict[str, Any]) -> dict:
    """
    Send a notification to a patient via SMS.

    Args:
        message: The text message to send to the patient.
        patient_info: A dictionary representing the patient, following the Users table schema:
            - id (STRING)
            - name (STRING)
            - role (STRING)
            - email (STRING)
            - phone (STRING, optional)
            - DateOfBirth (DATE, optional)
            - created_at (TIMESTAMP, optional)
            - updated_at (TIMESTAMP, optional)

    Returns:
        dict: Status of the notification and response from the SMS provider.
              Example: {"status": "SUCCESS", ...}
    """
    phone_number = patient_info["phone"]
    if not phone_number:
        return {"status": "FAILED", "message": "No phone number provided"}

    resp = send_patient_sms(phone_number, message)
    return resp

def check_inventory(
    filters: Dict[str, Union[Any, Tuple[str, Any], List[Any]]],
    limit: int = 50
) -> List[dict]:
    """
    Fetch inventory records from BigQuery with flexible filters.

    Filters must use field names from the inventory schema:

    Inventory Table Schema:
    - id (STRING)
    - name (STRING)
    - genericName (STRING)
    - ndc (STRING)
    - currentStock (INTEGER)
    - minThreshold (INTEGER)
    - maxStock (INTEGER)
    - lastReorder (DATE)
    - needsReorder (BOOLEAN)
    - supplier (STRING)
    - costPerUnit (NUMERIC(10,2))
    - expirationDate (DATE)
    - lotNumber (STRING)
    - location (STRING)
    - created_at (TIMESTAMP)
    - updated_at (TIMESTAMP)

    Args:
        filters: dict mapping column -> value or (operator, value).
                 Examples:
                    {"ndc": "12345-6789"}
                    {"currentStock": ("<=", 10)}
                    {"expirationDate": (">", "2025-01-01")}
        limit: maximum number of rows.

    Returns:
        List of inventory dicts (JSON-safe).
    """
    where_clauses = []
    for col, val in filters.items():
        if isinstance(val, (tuple, list)) and len(val) == 2:
            op, v = val
        else:
            op, v = "=", val

        if v is None:
            if op in ("=", "IS"):
                where_clauses.append(f"{col} IS NULL")
            elif op in ("!=", "<>", "IS NOT"):
                where_clauses.append(f"{col} IS NOT NULL")
        else:
            where_clauses.append(f"{col} {op} {format_value(INVENTORY_COLUMN_TYPES, col, v)}")

    where_sql = f"WHERE {' AND '.join(where_clauses)}" if where_clauses else ""
    sql = f"""
        SELECT *
        FROM `{gcp_project_id}.{dataset_id}.Inventory`
        {where_sql}
        LIMIT {limit}
    """
    print(f"sql query: {sql}")
    raw = query_bigquery_context(sql)
    import json
    try:
        rows = json.loads(raw)
        print(f"rows: {rows}")
        return rows
    except Exception:
        return []

# Step 1: Configure the planner
planner = BuiltInPlanner(
    thinking_config=ThinkingConfig(
        include_thoughts=True,
    )
)

# Step 2: Define the main LLM agent
root_agent = LlmAgent(
    name="pharmacy_assistant",
    model="gemini-2.5-flash",
    description="""
Coordinates pharmacy workflows autonomously by managing prescriptions, patients, and inventory levels.

Capabilities:
1. Query prescriptions flexibly: filter by patient, medication, status, dates, or any other field in the prescriptions schema.
2. Query and retrieve user information: filter by role, name, email, phone, or date of birth.
3. Contact patients with reminders for pickups or refills.
4. Monitor and query inventory: filter by NDC, stock thresholds, expiration dates, supplier, or any field in the inventory schema.
5. Generate clear action steps, always using the appropriate tool with correct parameters.
""",
    instruction="""
You are a pharmacy AI assistant. Your tasks:

1. Monitor prescriptions: Identify pending or waiting-for-pickup prescriptions.
2. Manage users: Query patient or staff details (e.g., role, name, contact information).
3. Contact patients: Send reminders for pickup or refills.
4. Monitor inventory: Alert staff about low stock, expiring medications, or controlled substances.

Use the following tools as needed:
- `get_prescriptions(filters, limit)`
- `get_users(filters, limit)`
- `notify_patient(message, patient_info)`
- `check_inventory(filters, limit)`

Respond in clear action steps, specifying which tool to call and the parameters to provide.
""",
    tools=[get_prescriptions, get_users, notify_patient, check_inventory],
    planner=planner,
    output_key="latest_action"
)
