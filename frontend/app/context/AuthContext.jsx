'use client';
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';  // ✅ Correct import

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken && savedToken.split('.').length === 3) {
      try {
        const decoded = jwtDecode(savedToken);
        console.log("Decoded JWT:", decoded); // Debug log
        // Check if token is expired
        if (decoded.exp * 1000 > Date.now()) {
          setToken(savedToken);
          const userData = { 
            id: decoded.userId, 
            username: decoded.sub, 
            role: decoded.role 
          };
          console.log("Setting user data:", userData); // Debug log
          setUser(userData);
        } else {
          localStorage.removeItem('token'); // remove expired token
        }
      } catch (error) {
        localStorage.removeItem('token'); // remove invalid token
      }
    } else {
      localStorage.removeItem('token'); // remove invalid token
    }
    setLoading(false);
  }, []);


  const login = (jwtToken) => {
  localStorage.setItem('token', jwtToken);
  setToken(jwtToken);
  const decoded = jwtDecode(jwtToken);
  console.log("Login - Decoded JWT:", decoded); // Debug log
  const userData = { 
    id: decoded.userId, 
    username: decoded.sub, 
    role: decoded.role 
  };
  console.log("Login - Setting user data:", userData); // Debug log
  setUser(userData);
};


  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
