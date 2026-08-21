import { useEffect, useState } from "react";
import { getCandidates, voteCandidate, updateCandidate, deleteCandidate } from "../api";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", party: "" });
  const role = localStorage.getItem("role");

  const loadCandidates = () => {
    getCandidates().then(setCandidates).catch((e) => setMessage(e.message));
  };

  useEffect(() => {
    loadCandidates();
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

  const handleDelete = async (id) => {
    setMessage("");
    try {
      await deleteCandidate(id);
      setMessage("Candidate deleted");
      loadCandidates();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditForm({ name: c.name, party: c.party });
  };

  const handleUpdate = async (id) => {
    setMessage("");
    try {
      await updateCandidate(id, editForm);
      setMessage("Candidate updated");
      setEditingId(null);
      loadCandidates();
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Candidates</h2>
      {message && <p className="info-msg">{message}</p>}
      <ul>
        {candidates.map((c, i) => (
          <li key={i}>
            {editingId === c._id ? (
              <>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
                <input
                  value={editForm.party}
                  onChange={(e) => setEditForm({ ...editForm, party: e.target.value })}
                />
                <button onClick={() => handleUpdate(c._id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span>{c.name} ({c.party})</span>
                <span>
                  {role !== "admin" && c._id && (
                    <button onClick={() => handleVote(c._id)}>Vote</button>
                  )}
                  {role === "admin" && (
                    <>
                      <button className="edit-btn" onClick={() => startEdit(c)}>Edit</button>
                      <button className="delete-btn" onClick={() => handleDelete(c._id)}>Delete</button>
                    </>
                  )}
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}