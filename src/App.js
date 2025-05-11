import React, { useState } from "react";
import "./App.css";

const DROPDOWN_OPTIONS = [
  { label: "Alphabets", value: "alphabets" },
  { label: "Numbers", value: "numbers" },
  { label: "Highest Lowercase Alphabet", value: "highest_lowercase_alphabet" }
];

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSubmit = async () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!parsed.data) throw new Error("Missing 'data' field");

      setError("");
      const res = await fetch("https://project-2-2-pgn5.onrender.com/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed)
      });

      const data = await res.json();
      setResponseData(data);
    } catch (e) {
      setError("Invalid JSON input: " + e.message);
      setResponseData(null);
    }
  };

  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    if (checked) setSelectedOptions([...selectedOptions, value]);
    else setSelectedOptions(selectedOptions.filter((opt) => opt !== value));
  };

  const filteredResponse = () => {
    if (!responseData) return {};
    const result = {};
    selectedOptions.forEach((opt) => {
      result[opt] = responseData[opt];
    });
    return result;
  };

  return (
    <div className="container">
      <h1>ABCD123</h1>
      <textarea
        placeholder='Enter JSON e.g. {"data": ["A", "4", "b"]}'
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p className="error">{error}</p>}

      {responseData && (
        <>
          <h3>Select fields to show from response:</h3>
          <div className="dropdown">
            {DROPDOWN_OPTIONS.map((opt) => (
              <label key={opt.value}>
                <input
                  type="checkbox"
                  value={opt.value}
                  onChange={handleOptionChange}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <h3>Filtered Output:</h3>
          <pre>{JSON.stringify(filteredResponse(), null, 2)}</pre>
        </>
      )}
    </div>
  );
}

export default App;
