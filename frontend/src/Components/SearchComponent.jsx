import React, { useState } from 'react';

function SearchComponent() {
  const [jobQuery, setJobQuery] = useState('');
  const [hobbyQuery, setHobbyQuery] = useState('');
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });
  const [locationQuery, setLocationQuery] = useState('');
  const [qualitiesQuery, setQualitiesQuery] = useState('');
  const [genderQuery, setGenderQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  // Handle form submission and fetch data
  const handleSearch = async (e) => {
    e.preventDefault();
    
    const searchParams = {
      job_query: jobQuery,
      hobby_query: hobbyQuery ? hobbyQuery.split(',') : [],
      age_range: ageRange.min && ageRange.max ? { min: parseInt(ageRange.min), max: parseInt(ageRange.max) } : null,
      location_query: locationQuery,
      qualities_query: qualitiesQuery ? qualitiesQuery.split(',') : [],
      gender_query: genderQuery,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchParams),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Received data:', data); // Debug log

      if (response.status === 200) {
        setResults(data);
        setError('');
      } else {
        setError(data.message || 'No matching records found');
        setResults([]);
      }
    } catch (err) {
      setError('Failed to fetch data');
      setResults([]);
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Search Partners</h1>
      <form onSubmit={handleSearch} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        {/* Form fields for search criteria */}
        <div className="mb-4">
          <label className="block text-lg font-medium" htmlFor="jobQuery">Job Query</label>
          <input
            id="jobQuery"
            type="text"
            value={jobQuery}
            onChange={(e) => setJobQuery(e.target.value)}
            className="w-full p-2 mt-1 border border-gray-300 rounded-lg"
            placeholder="Enter job title"
          />
        </div>
        {/* Add other form fields for hobbies, age, location, etc. */}

        <button type="submit" className="w-full py-2 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Search
        </button>
      </form>

      {/* Display error or search results */}
      {error && <div className="text-red-600 text-center mt-6">{error}</div>}
      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Search Results</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index} className="bg-gray-100 p-4 mb-4 rounded-lg shadow-md">
                <p><strong>Job:</strong> {result.job}</p>
                <p><strong>Hobbies:</strong> {result.hobbies}</p>
                <p><strong>Age:</strong> {result.age}</p>
                <p><strong>Location:</strong> {result.location}</p>
                <p><strong>Qualities:</strong> {result.qualities}</p>
                <p><strong>Gender:</strong> {result.gender}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchComponent;
