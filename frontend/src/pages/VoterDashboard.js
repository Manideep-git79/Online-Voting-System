import { useEffect, useState } from "react";
import { getCandidates, voteCandidate, getProfile } from "../api";

export default function VoterDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votingId, setVotingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [candidatesRes, profileRes] = await Promise.all([getCandidates(), getProfile()]);
      setCandidates(candidatesRes);
      setHasVoted(profileRes.user.isVoted);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleVote = async (id) => {
    setMessage(null);
    setVotingId(id);
    try {
      const res = await voteCandidate(id);
      setMessage({ type: "success", text: res.message });
      setHasVoted(true);
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setVotingId(null);
    }
  };

  if (loading) return <div className="page-loader">Loading candidates...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Cast Your Vote</h2>
        <p>Choose a candidate below. You can only vote once.</p>
      </div>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
      {hasVoted && <div className="alert alert-info">✅ You have already cast your vote. Thank you for participating.</div>}

      <div className="candidate-grid">
        {candidates.map((c) => (
          <div key={c._id} className="candidate-card">
            <div className="candidate-avatar">{c.name.charAt(0).toUpperCase()}</div>
            <h3>{c.name}</h3>
            <p className="party-tag">{c.party}</p>
            <button disabled={hasVoted || votingId === c._id} onClick={() => handleVote(c._id)}>
              {votingId === c._id ? "Voting..." : "Vote"}
            </button>
          </div>
        ))}
        {candidates.length === 0 && <p>No candidates available yet.</p>}
      </div>
    </div>
  );
}