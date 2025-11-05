import React, { createContext, useState, useEffect } from "react";
import { me } from "../api/auth";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [access, setAccess] = useState(localStorage.getItem("access"));
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh"));

  useEffect(() => {
    if (access) {
      me(access)
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          setUser(null);
        });
    }
  }, [access]);

  const login = ({ access: a, refresh: r, user }) => {
    setAccess(a);
    setRefresh(r);
    setUser(user || {});
    localStorage.setItem("access", a);
    localStorage.setItem("refresh", r);
  };
  const logout = () => {
    setUser(null);
    setAccess(null);
    setRefresh(null);
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  return (
    <AuthContext.Provider value={{ user, access, refresh, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
