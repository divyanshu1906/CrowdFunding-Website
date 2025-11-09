import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function HomeNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isAuthenticated = Boolean(
    user && (user.id || user.username || (user.user && user.user.id) || user.profile)
  );

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
  <header className="home-navbar flex justify-between items-center px-8 py-4 bg-white shadow-md">
      {/* 🔹 Left: Logo / Title */}
      <h1
        className="text-2xl font-bold text-primary cursor-pointer"
        onClick={() => navigate("/")}
      >
        CrowdFunding
      </h1>

      {/* 🔹 Right: show profile dropdown when authenticated, otherwise Login/Register */}
      <div className="relative" ref={menuRef}>
        {isAuthenticated ? (
          <>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-profile"
            >
              {/* Optional avatar circle */}
              <div className="avatar-circle w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>

              <span>{user?.username || "Profile"}</span>

              <svg
                className={`w-4 h-4 transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* 🔽 Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
                  className="dropdown-btn-profile"
                >
                  👤 View Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate("/dashboard");
                  }}
                  className="dropdown-btn-logout"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50 transition"
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
