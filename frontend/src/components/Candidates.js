import { useEffect, useState } from "react";
import { getCandidates, voteCandidate } from "../api";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
    getCandidates().then(setCandidates).catch((e) => setMessage(e.message));
  }, []);

  const handleVote = async (id) => {
    setMessage("");
    try {
      const res = await voteCandidate(id);
      setMessage(res.message);
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Candidates</h2>
      {message && <p>{message}</p>}
      <ul>
        {candidates.map((c, i) => (
          <li key={i}>
            {c.name} ({c.party})
            {role !== "admin" && c._id && (
              <button onClick={() => handleVote(c._id)}>Vote</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}