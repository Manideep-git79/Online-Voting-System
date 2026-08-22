import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi, getProfile } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ aadharCardNumber: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginApi(form);
      localStorage.setItem("token", res.token);
      const profile = await getProfile();
      login(res.token, profile.user.role, profile.user.name);
      navigate(profile.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Login to cast your vote or manage the election</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label>Aadhar Card Number</label>
          <input name="aadharCardNumber" placeholder="12-digit Aadhar number" onChange={handleChange} required />
          <label>Password</label>
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </form>
        <p className="auth-switch">Don't have an account? <a href="/signup">Signup</a></p>
      </div>
    </div>
  );
}