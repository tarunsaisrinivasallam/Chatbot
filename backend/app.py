from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

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
        
        # Ensure job_query is a string
        job_query = filters.get("job_query", "").lower() if filters.get("job_query") else ""
        
        # Ensure hobby_query and qualities_query are lists (split only if they're strings)
        hobby_query = filters.get("hobby_query", [])
        if isinstance(hobby_query, str):
            hobby_query = hobby_query.split(",")
        
        age_range = filters.get("age_range", [])
        location_query = filters.get("location_query", "").lower() if filters.get("location_query") else ""
        
        qualities_query = filters.get("qualities_query", [])
        if isinstance(qualities_query, str):
            qualities_query = qualities_query.split(",")
        
        gender_query = filters.get("gender_query", "").lower() if filters.get("gender_query") else ""

        # Define row matching logic
        def row_matches(row):
            job_match = job_query in row["job"].lower() if "job" in row and pd.notnull(row["job"]) else True
            hobby_match = any(hobby.lower() in row["hobbies"].lower() for hobby in hobby_query) if hobby_query and "hobbies" in row and pd.notnull(row["hobbies"]) else True
            age_match = int(row["age"]) in age_range if age_range and "age" in row and pd.notnull(row["age"]) else True
            location_match = location_query in row["location"].lower() if location_query and "location" in row and pd.notnull(row["location"]) else True
            qualities_match = any(quality.lower() in row["qualities"].lower() for quality in qualities_query) if qualities_query and "qualities" in row and pd.notnull(row["qualities"]) else True
            gender_match = gender_query == row["gender"].lower() if gender_query and "gender" in row and pd.notnull(row["gender"]) else True

            return job_match and hobby_match and age_match and location_match and qualities_match and gender_match

        # Apply filter
        filtered_data = data[data.apply(row_matches, axis=1)]

        if filtered_data.empty:
            return jsonify({"results": []}), 200
        
        return jsonify({"results": filtered_data.to_dict(orient="records")}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
