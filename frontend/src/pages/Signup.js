import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup as signupApi } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [form, setForm] = useState({
    name: "", age: "", email: "", mobile: "",
    address: "", aadharCardNumber: "", password: "", role: "voter",
  });
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
      const res = await signupApi({ ...form, age: Number(form.age) });
      login(res.token, res.response.role, res.response.name);
      navigate(res.response.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Register to vote, or as admin to manage the election</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit} className="grid-form">
          <div>
            <label>Full Name</label>
            <input name="name" onChange={handleChange} required />
          </div>
          <div>
            <label>Age</label>
            <input name="age" type="number" onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input name="email" type="email" onChange={handleChange} />
          </div>
          <div>
            <label>Mobile</label>
            <input name="mobile" onChange={handleChange} />
          </div>
          <div className="span-2">
            <label>Address</label>
            <input name="address" onChange={handleChange} required />
          </div>
          <div>
            <label>Aadhar Card Number</label>
            <input name="aadharCardNumber" placeholder="12 digits" onChange={handleChange} required />
          </div>
          <div>
            <label>Password</label>
            <input name="password" type="password" onChange={handleChange} required />
          </div>
          <div className="span-2">
            <label>Register As</label>
            <select name="role" onChange={handleChange}>
              <option value="voter">Voter</option>
              <option value="admin">Admin (only one allowed)</option>
            </select>
          </div>
          <div className="span-2">
            <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Signup"}</button>
          </div>
        </form>
        <p className="auth-switch">Already have an account? <a href="/login">Login</a></p>
      </div>
    </div>
  );
}