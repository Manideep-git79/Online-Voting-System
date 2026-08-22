import { useEffect, useState } from "react";
import { getCandidates, addCandidate, updateCandidate, deleteCandidate } from "../api";

export default function AdminDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", party: "", age: "" });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", party: "", age: "" });

  const load = async () => {
    setLoading(true);
    try {
      setCandidates(await getCandidates());
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      await addCandidate({ ...form, age: Number(form.age) });
      setMessage({ type: "success", text: "Candidate added successfully" });
      setForm({ name: "", party: "", age: "" });
      setShowForm(false);
      load();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const startEdit = (c) => {
    setEditingId(c._id);
    setEditForm({ name: c.name, party: c.party, age: c.age });
  };

  const handleUpdate = async (id) => {
    setMessage(null);
    try {
      await updateCandidate(id, { ...editForm, age: Number(editForm.age) });
      setMessage({ type: "success", text: "Candidate updated" });
      setEditingId(null);
      load();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this candidate?")) return;
    setMessage(null);
    try {
      await deleteCandidate(id);
      setMessage({ type: "success", text: "Candidate deleted" });
      load();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    }
  };

  if (loading) return <div className="page-loader">Loading dashboard...</div>;

  return (
    <div className="page">
      <div className="page-header">
        <h2>Manage Candidates</h2>
        <p>Add, edit, or delete election candidates.</p>
      </div>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Cancel" : "+ Add Candidate"}
      </button>

      {showForm && (
        <form className="inline-form" onSubmit={handleAdd}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Party" value={form.party} onChange={(e) => setForm({ ...form, party: e.target.value })} required />
          <input placeholder="Age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required />
          <button type="submit">Save</button>
        </form>
      )}

      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Party</th><th>Age</th><th>Votes</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {candidates.map((c) => (
            <tr key={c._id}>
              {editingId === c._id ? (
                <>
                  <td><input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} /></td>
                  <td><input value={editForm.party} onChange={(e) => setEditForm({ ...editForm, party: e.target.value })} /></td>
                  <td><input type="number" value={editForm.age} onChange={(e) => setEditForm({ ...editForm, age: e.target.value })} /></td>
                  <td>{c.voteCount}</td>
                  <td>
                    <button className="save-btn" onClick={() => handleUpdate(c._id)}>Save</button>
                    <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{c.name}</td>
                  <td>{c.party}</td>
                  <td>{c.age}</td>
                  <td><span className="vote-badge">{c.voteCount}</span></td>
                  <td>
                    <button className="edit-btn" onClick={() => startEdit(c)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(c._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
          {candidates.length === 0 && (
            <tr><td colSpan="5" style={{ textAlign: "center" }}>No candidates yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}