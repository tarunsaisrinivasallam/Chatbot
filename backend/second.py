from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from the React app

# Load the CSV data once when the app starts
file_path = './gopaldataset.csv'  # Ensure this is the correct path to your CSV file
data = pd.read_csv(file_path)  # Load data into a DataFrame

# Columns in the dataset
# Columns: Name, Age, Gender, Salary, Hobbies, Qualities in Life Partner, Location of Job, Job Role

def search_data(query):
    """
    Search for rows in the data that contain the query term in any cell of the row.
    """
    # Filter rows where any cell contains the query (case-insensitive)
    filtered_data = data.apply(lambda row: row.astype(str).str.contains(query, case=False, na=False).any(), axis=1)
    result = data[filtered_data]
    return result

# Define the search endpoint
@app.route('/search', methods=['GET'])
def search():
    # Get the query parameter from the URL
    query = request.args.get('query')
    if not query:
        return jsonify({"error": "No query parameter provided"}), 400

    # Perform the search
    result = search_data(query)

    # If no results found, return a message
    if result.empty:
        return jsonify({"message": "No matching records found."})

    # Convert the result to JSON format
    result_json = result.to_dict(orient='records')
    return jsonify(result_json)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
