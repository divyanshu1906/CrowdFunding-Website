import React from "react";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10 text-center md:text-left">
        {/* About */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            About CrowdFunding
          </h3>
          <p className="text-sm text-gray-400">
            A platform to support creators in film, music, and art. Join the
            community and help bring creative ideas to life!
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <button
                onClick={() => navigate("/project")}
                className="hover:underline"
              >
                Browse Projects
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/start-project")}
                className="hover:underline"
              >
                Start a Project
              </button>
            </li>
            <li>
              <button
                onClick={() => navigate("/profile")}
                className="hover:underline"
              >
                My Profile
              </button>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Contact Us
          </h3>
          <p className="text-sm text-gray-400">
            📧 support@crowdfunding.com <br />
            📍 Jalandhar, India
          </p>
          <div className="flex justify-center md:justify-start gap-4 mt-4 text-lg">
            <a href="#" className="hover:text-white">🌐</a>
            <a href="#" className="hover:text-white">🐦</a>
            <a href="#" className="hover:text-white">📸</a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        © {new Date().getFullYear()} CrowdFunding. All rights reserved.
      </div>
    </footer>
  );
}
