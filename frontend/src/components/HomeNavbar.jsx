import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function HomeNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
    <header className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      {/* 🔹 Left: Logo / Title */}
      <h1
        className="text-2xl font-bold text-blue-600 cursor-pointer"
        onClick={() => navigate("/")}
      >
        CrowdFunding
      </h1>

      {/* 🔹 Right: Profile Button + Dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          {/* Optional avatar circle */}
          <div className="w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center font-bold">
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
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              👤 View Profile
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
