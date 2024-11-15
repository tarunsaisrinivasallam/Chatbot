from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app) 

# Load dataset
file_path = r"./gopaldataset.csv"
try:
    data = pd.read_csv(file_path)
    print("Data Loaded Successfully.")
except FileNotFoundError:
    print("Error: File not found. Please check the file path.")
    data = pd.DataFrame()

@app.route("/search", methods=["POST"])
def search():
    if data.empty:
        return jsonify({"error": "Dataset not loaded"}), 500

    try:
        # Get request data
        filters = request.json
        job_query = filters.get("job_query", "").lower()
        hobby_query = filters.get("hobby_query", [])
        age_range = filters.get("age_range", [])
        location_query = filters.get("location_query", "").lower()
        qualities_query = filters.get("qualities_query", [])
        gender_query = filters.get("gender_query", "").lower()

        # Define row matching logic
        def row_matches(row):
            job_match = job_query in row["job"].lower() if "job" in row and pd.notnull(row["job"]) else False
            hobby_match = any(hobby.lower() in row["hobbies"].lower() for hobby in hobby_query) if hobby_query and "hobbies" in row and pd.notnull(row["hobbies"]) else False
            age_match = int(row["age"]) in age_range if age_range and "age" in row and pd.notnull(row["age"]) else False
            location_match = location_query in row["location"].lower() if location_query and "location" in row and pd.notnull(row["location"]) else False
            qualities_match = any(quality.lower() in row["qualities"].lower() for quality in qualities_query) if qualities_query and "qualities" in row and pd.notnull(row["qualities"]) else False
            gender_match = gender_query == row["gender"].lower() if gender_query and "gender" in row and pd.notnull(row["gender"]) else False

            return job_match or hobby_match or age_match or location_match or qualities_match or gender_match

        # Apply filter
        filtered_data = data[data.apply(row_matches, axis=1)]

        if filtered_data.empty:
            return jsonify({"results": []}), 200
        
        return jsonify({"results": filtered_data.to_dict(orient="records")}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
