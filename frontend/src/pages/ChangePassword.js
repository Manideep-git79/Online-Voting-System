import { useState } from "react";
import { changePassword } from "../api";

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await changePassword(form);
      setMessage({ type: "success", text: res.message });
      setForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Change Password</h2>
        {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
        <form onSubmit={handleSubmit}>
          <label>Current Password</label>
          <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} required />
          <label>New Password</label>
          <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} required />
          <button type="submit" disabled={loading}>{loading ? "Updating..." : "Update Password"}</button>
        </form>
      </div>
    </div>
  );
}