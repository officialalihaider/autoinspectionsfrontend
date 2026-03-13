import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const Ctx = createContext();
const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ag_token'));
  const [loading, setLd]  = useState(true);
  useEffect(() => {
    if (token) { axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; localStorage.setItem('ag_token', token); }
    else { delete axios.defaults.headers.common['Authorization']; localStorage.removeItem('ag_token'); }
  }, [token]);
  useEffect(() => {
    if (!token) { setLd(false); return; }
    axios.get(`${BASE}/auth/me`).then(r => setUser(r.data.user)).catch(() => { setToken(null); setUser(null); }).finally(() => setLd(false));
  }, []);
  const signup = async (n,e,p) => { const r = await axios.post(`${BASE}/auth/signup`,{name:n,email:e,password:p}); setToken(r.data.token); setUser(r.data.user); return r.data; };
  const login  = async (e,p)   => { const r = await axios.post(`${BASE}/auth/login`,{email:e,password:p});         setToken(r.data.token); setUser(r.data.user); return r.data; };
  const logout = () => { setToken(null); setUser(null); };
  return <Ctx.Provider value={{ user,token,loading,signup,login,logout,isAuth:!!user }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
