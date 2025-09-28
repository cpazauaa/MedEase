import os
import json
from typing import Dict, Any, List
from google.cloud import bigquery
from twilio.rest import Client as TwilioClient
from datetime import datetime, date
from decimal import Decimal
import pandas as pd

# -------------------------
# BigQuery Utilities
# -------------------------
def json_safe(val):
    if isinstance(val, (datetime, date, pd.Timestamp)):
        return val.isoformat()
    if isinstance(val, Decimal):
        # Convert to float (or str if you want exact precision)
        return float(val)
    return val

def get_bigquery_client() -> bigquery.Client:
    """
    Returns a BigQuery client using GOOGLE_APPLICATION_CREDENTIALS
    and project ID from environment variables.
    """
    project_id = os.getenv('GOOGLE_CLOUD_PROJECT')
    if not project_id:
        raise ValueError("GOOGLE_CLOUD_PROJECT environment variable not set")
    return bigquery.Client(project=project_id)

def query_bigquery_context(sql_query: str) -> str:
    "Executes a SELECT query on BigQuery to retrieve patient info, drug name, or inventory data required for decision making."
    bq_client = get_bigquery_client()
    print(f"[ADK TOOL] Executing BigQuery SELECT: {sql_query[:50]}...")
    try:
        query_job = bq_client.query_and_wait(sql_query)
        df = query_job.to_dataframe()
        records = df.to_dict(orient="records")
        safe_records = [
            {k: json_safe(v) for k, v in row.items()}
            for row in records
        ]
        return json.dumps(safe_records)
    except Exception as e:
        return json.dumps({"status": "ERROR", "message": str(e)})

# -------------------------
# Twilio SMS Utility
# -------------------------
def normalize_us_phone(phone: str) -> str:
    """
    Normalize a US phone number from 'xxx-xxx-xxxx' format into E.164 format '+1xxxxxxxxxx'.

    Args:
        phone (str): Phone number as a string in 'xxx-xxx-xxxx' format.

    Returns:
        str: Normalized phone number in E.164 format for Twilio.
    """
    # Strip any non-numeric characters (like dashes, spaces, parentheses)
    digits = "".join([c for c in phone if c.isdigit()])

    if len(digits) != 10:
        raise ValueError(f"Invalid US phone number format: {phone}")

    return f"+1{digits}"

def send_patient_sms(to_number: str, message_body: str) -> str:
    """
    Sends an SMS message using Twilio.
    """
    account_sid = os.getenv("TWILIO_ACCOUNT_SID")
    auth_token = os.getenv("TWILIO_AUTH_TOKEN")
    twilio_number = os.getenv("TWILIO_PHONE_NUMBER")

    if not all([account_sid, auth_token, twilio_number]):
        raise ValueError("Twilio environment variables not set")

    try:
        # Normalize to Twilio-friendly E.164 format
        normalized_number = normalize_us_phone(to_number)

        client = TwilioClient(account_sid, auth_token)
        message = client.messages.create(
            body=message_body,
            from_=twilio_number,
            to=normalized_number
        )
        print(f"[ADK TOOL] SMS sent to {to_number}, SID: {message.sid}")
        return json.dumps({
            "status": "SUCCESS",
            "sid": message.sid,
            "to": to_number
        })
    except Exception as e:
        print(f"[ADK TOOL] Twilio SMS error: {e}")
        return json.dumps({"status": "ERROR", "message": str(e)})

