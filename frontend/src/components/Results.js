import { useEffect, useState } from "react";
import { getResults } from "../api";

export default function Results() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    getResults().then(setResults);
  }, []);

  return (
    <div className="container">
      <h2>Results</h2>
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            <span>{r.party}</span>
            <span>{r.count} votes</span>
          </li>
        ))}
      </ul>
    </div>
  );
}