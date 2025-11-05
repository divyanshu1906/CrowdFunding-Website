import React, { createContext, useState, useEffect } from "react";
import { me } from "../api/auth";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(localStorage.getItem("access"));
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh"));
  const [loading, setLoading] = useState(true); // ✅ prevent early redirects

  // ✅ Refresh the access token if expired
  const refreshAccessToken = async () => {
    if (!refresh) return null;
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh });
      localStorage.setItem("access", res.data.access);
      setAccess(res.data.access);
      return res.data.access;
    } catch (err) {
      console.warn("Refresh token expired or invalid. Logging out.");
      logout();
      return null;
    }
  };

  // ✅ Load user info on startup or token change
  useEffect(() => {
    const fetchUser = async () => {
      if (!access) {
        setLoading(false);
        return;
      }

      try {
        const data = await me(access);
        setUser(data);
      } catch (err) {
        // Access token might be expired → try refreshing
        const newAccess = await refreshAccessToken();
        if (newAccess) {
          const data = await me(newAccess);
          setUser(data);
        } else {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [access]);

  const login = ({ access: a, refresh: r, user }) => {
    localStorage.setItem("access", a);
    localStorage.setItem("refresh", r);
    setAccess(a);
    setRefresh(r);
    setUser(user || {});
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
    setAccess(null);
    setRefresh(null);
  };

  return (
    <AuthContext.Provider value={{ user, access, refresh, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
