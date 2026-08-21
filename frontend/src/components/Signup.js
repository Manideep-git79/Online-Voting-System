import { useState } from "react";
import { signup } from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "", age: "", email: "", mobile: "",
    address: "", aadharCardNumber: "", password: "", role: "voter",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await signup({ ...form, age: Number(form.age) });
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.response.role);
      navigate("/candidates");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
     <div className="container">
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>
      {error && <p className="error">{error}</p>}
      <input name="name" placeholder="Name" onChange={handleChange} required /><br/>
      <input name="age" type="number" placeholder="Age" onChange={handleChange} required /><br/>
      <input name="email" placeholder="Email" onChange={handleChange} /><br/>
      <input name="mobile" placeholder="Mobile" onChange={handleChange} /><br/>
      <input name="address" placeholder="Address" onChange={handleChange} required /><br/>
      <input name="aadharCardNumber" placeholder="Aadhar (12 digits)" onChange={handleChange} required /><br/>
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required /><br/>
      <select name="role" onChange={handleChange}>
        <option value="voter">Voter</option>
        <option value="admin">Admin</option>
      </select><br/>
      <button type="submit">Signup</button>
    </form>
    </div>
  );
}