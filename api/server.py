from flask import Flask, jsonify, request
from flask_cors import CORS
from google.cloud import bigquery
from google.oauth2 import service_account


app = Flask(__name__)
CORS(app)
credentials = service_account.Credentials.from_service_account_file('path/to/your/service-account-file.json')
bq_client = bigquery.Client(credentials=credentials, project=credentials.project_id)
@app.route('/api/pharmacy/home')
def pharmacy_home():
    query="""
    SELECT 
        SUM(currentStock) as total_medicines,
        COUNTIF(currentStock < minThreshold) as low_stock_items
        FROM `med-ease-473410.MedEase.inventory`
    """
    row=list(bq_client.query(query))[0]
    return jsonify({k:row[k] for k in row.keys()}) 


@app.route('/api/medicines')
def get_medicines():
    search=request.args.get('q','').lower()
    sql = """
    SELECT id, name,currentStock,expirationDate,costPerUnit,location 
    FROM `med-ease-473410.MedEase.inventory`
    ORDER BY name
    """
    where_clause=""
    params=[]
    if search:
        where_clause=" WHERE LOWER(name) LIKE @q"
        params.append(bigquery.ScalarQueryParameter("q", "STRING", f"%{search}%"))
    query=sql.format(where=where_clause)
    job_config = bigquery.QueryJobConfig(query_parameters=params)
    rows = bq_client.query(query, job_config=job_config)
    data = [dict(row.items()) for row in rows]
    return jsonify(data)

@app.route('/api/medicine/')
def medicine_details():
    sql = """
    SELECT status
    from `med-ease-473410.MedEase.prescription`
    WHERE 
    
    """
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)

