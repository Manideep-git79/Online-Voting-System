import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));

  const login = (newToken, newRole, name) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("role", newRole);
    localStorage.setItem("userName", name || "");
    setToken(newToken);
    setRole(newRole);
    setUserName(name);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUserName(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);