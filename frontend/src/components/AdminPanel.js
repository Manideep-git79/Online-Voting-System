import { useState } from "react";
import { addCandidate } from "../api";

export default function AdminPanel() {
  const [form, setForm] = useState({ name: "", party: "", age: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      await addCandidate({ ...form, age: Number(form.age) });
      setMessage("Candidate added successfully");
      setForm({ name: "", party: "", age: "" });
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="container">
      <h2>Add Candidate</h2>
      {message && <p className="info-msg">{message}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Candidate Name" value={form.name} onChange={handleChange} required />
        <input name="party" placeholder="Party" value={form.party} onChange={handleChange} required />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
        <button type="submit">Add Candidate</button>
      </form>
    </div>
  );
}