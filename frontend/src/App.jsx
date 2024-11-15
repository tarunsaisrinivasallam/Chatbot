import React, { useState } from "react";

const App = () => {
  const [filters, setFilters] = useState({
    job_query: "",
    hobby_query: "",
    age_range: { min: "", max: "" },
    location_query: "",
    qualities_query: "",
    gender_query: "",
  });

  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);  // Set loading state to true when request starts
    setError(""); // Reset any previous error
    setResults([]); // Reset previous results
    
    try {
      console.log("Sending request with filters:", filters);

      const response = await fetch("http://127.0.0.1:5000/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...filters,
          hobby_query: filters.hobby_query.split(","),
          qualities_query: filters.qualities_query.split(","),
          age_range:
            filters.age_range.min && filters.age_range.max
              ? Array.from(
                  { length: filters.age_range.max - filters.age_range.min + 1 },
                  (_, i) => i + Number(filters.age_range.min)
                )
              : [],
        }),
      });
      
      const data = await response.json();
      console.log("Response received:", data);  // Debug log for response

      if (response.ok) {
        setResults(data.results || []);  // Set the results to the state
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error("Error during fetch:", err);  // Debug log for errors
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);  // Set loading to false after the request is completed
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Search Application</h1>
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block font-medium">Job Query</label>
          <input
            type="text"
            value={filters.job_query}
            onChange={(e) => setFilters({ ...filters, job_query: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Hobbies (comma-separated)</label>
          <input
            type="text"
            value={filters.hobby_query}
            onChange={(e) => setFilters({ ...filters, hobby_query: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Age Range</label>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Min"
              value={filters.age_range.min}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  age_range: { ...filters.age_range, min: e.target.value },
                })
              }
              className="w-full border rounded p-2"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.age_range.max}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  age_range: { ...filters.age_range, max: e.target.value },
                })
              }
              className="w-full border rounded p-2"
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block font-medium">Location</label>
          <input
            type="text"
            value={filters.location_query}
            onChange={(e) => setFilters({ ...filters, location_query: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Qualities (comma-separated)</label>
          <input
            type="text"
            value={filters.qualities_query}
            onChange={(e) => setFilters({ ...filters, qualities_query: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium">Gender</label>
          <input
            type="text"
            value={filters.gender_query}
            onChange={(e) => setFilters({ ...filters, gender_query: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white font-bold p-2 rounded hover:bg-blue-600"
        >
          Search
        </button>
        {loading && <p className="mt-4 text-blue-500">Loading...</p>}
        {error && <div className="text-red-500 mt-4">{error}</div>}
        <div className="mt-6">
          {results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 text-left border-b">Job</th>
                    <th className="py-2 px-4 text-left border-b">Hobbies</th>
                    <th className="py-2 px-4 text-left border-b">Age</th>
                    <th className="py-2 px-4 text-left border-b">Location</th>
                    <th className="py-2 px-4 text-left border-b">Qualities</th>
                    <th className="py-2 px-4 text-left border-b">Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index} className="odd:bg-gray-50 even:bg-gray-100">
                      <td className="py-2 px-4 border-b">{result["Job Role"] || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{result.Hobbies || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{result.Age || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{result["Location of Job"] || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{result["Qualities in Life Partner"] || "N/A"}</td>
                      <td className="py-2 px-4 border-b">{result.Gender || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && <p className="text-gray-500">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
