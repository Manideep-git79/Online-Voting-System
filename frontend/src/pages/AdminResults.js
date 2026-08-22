import { useEffect, useState } from "react";
import { getVoteCounts } from "../api";

export default function AdminResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVoteCounts().then(setResults).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-loader">Loading results...</div>;

  const maxVotes = Math.max(1, ...results.map((r) => r.count));

  return (
    <div className="page">
      <div className="page-header">
        <h2>Live Results</h2>
        <p>Vote count per candidate, ranked highest to lowest.</p>
      </div>

      <div className="results-list">
        {results.map((r, i) => (
          <div key={i} className="result-row">
            <div className="result-label">
              <strong>{r.name}</strong>
              <span className="party-tag">{r.party}</span>
            </div>
            <div className="result-bar-track">
              <div className="result-bar-fill" style={{ width: `${(r.count / maxVotes) * 100}%` }} />
            </div>
            <div className="result-count">{r.count} votes</div>
          </div>
        ))}
        {results.length === 0 && <p>No votes recorded yet.</p>}
      </div>
    </div>
  );
}