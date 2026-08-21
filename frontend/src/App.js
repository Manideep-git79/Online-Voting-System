import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Candidates from "./components/Candidates";
import Results from "./components/Results";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

export default function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <BrowserRouter>
      <nav>
        {!token && <><Link to="/signup">Signup</Link> | <Link to="/login">Login</Link></>}
        {token && <Link to="/candidates">Candidates</Link>}
        {token && role === "admin" && <> | <Link to="/results">Results</Link></>}
        {token && <> | <button onClick={handleLogout}>Logout</button></>}
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/candidates"
          element={
            <ProtectedRoute>
              <Candidates />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Results />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}