from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import bigquery
from google.oauth2 import service_account

app = Flask(__name__)
CORS(app)

# BigQuery client setup
credentials = service_account.Credentials.from_service_account_file(
    'path/to/your/service-account-file.json'
)
bq_client = bigquery.Client(credentials=credentials, project=credentials.project_id)

# Route: Pharmacy home summary
@app.route('/api/pharmacy/home')
def pharmacy_home():
    query = """
    SELECT 
        SUM(currentStock) AS total_medicines,
        COUNTIF(currentStock < minThreshold) AS low_stock_items
    FROM `med-ease-473410.MedEase.inventory`
    """
    row = list(bq_client.query(query))[0]
    return jsonify({k: row[k] for k in row.keys()})

# Route: List of medicines, optional search
@app.route('/api/medicines')
def get_medicines():
    search = request.args.get('q', '').lower()
    
    sql = """
    SELECT id, name, currentStock, expirationDate, costPerUnit, location
    FROM `med-ease-473410.MedEase.inventory`
    """
    
    params = []
    if search:
        sql += " WHERE LOWER(name) LIKE @search"
        params.append(bigquery.ScalarQueryParameter("search", "STRING", f"%{search}%"))
    
    sql += " ORDER BY name"
    
    job_config = bigquery.QueryJobConfig(query_parameters=params)
    rows = bq_client.query(sql, job_config=job_config)
    
    data = [dict(row.items()) for row in rows]
    return jsonify(data)

# Route: Medicine details by ID
@app.route('/api/medicine/<int:medicine_id>')
def medicine_details(medicine_id):
    sql = """
    SELECT status, prescriptionId, patientId, doctorId
    FROM `med-ease-473410.MedEase.prescription`
    WHERE medicineId = @med_id
    """
    params = [bigquery.ScalarQueryParameter("med_id", "INT64", medicine_id)]
    job_config = bigquery.QueryJobConfig(query_parameters=params)
    rows = bq_client.query(sql, job_config=job_config)
    data = [dict(row.items()) for row in rows]
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
