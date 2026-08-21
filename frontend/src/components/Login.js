import { useState } from "react";
import { login, getProfile } from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ aadharCardNumber: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(form);
      localStorage.setItem("token", res.token);

      const profile = await getProfile();
      localStorage.setItem("role", profile.user.role);

      navigate("/candidates");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input name="aadharCardNumber" placeholder="Aadhar Number" onChange={handleChange} required /><br/>
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br/>
      <button type="submit">Login</button>
    </form>
    </div>
  );
}