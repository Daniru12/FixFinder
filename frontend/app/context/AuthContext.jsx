'use client';
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // ✅ Correct import

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      const decoded = jwtDecode(savedToken);
      setUser({ username: decoded.sub, role: decoded.role });
    }
  }, []);

  const login = (jwtToken) => {
    localStorage.setItem('token', jwtToken);
    setToken(jwtToken);
    const decoded = jwtDecode(jwtToken);
    setUser({ username: decoded.sub, role: decoded.role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
