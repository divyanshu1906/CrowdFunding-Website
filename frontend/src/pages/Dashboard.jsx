import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import HomeNavbar from "../components/HomeNavbar";

export default function Dashboard() {
  const { user, loading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  // Treat user as authenticated only when it contains expected fields.
  const isAuthenticated = Boolean(
    user && (user.id || user.username || (user.user && user.user.id) || user.profile)
  );

  const isCreator = Boolean(
    (user && user.profile && user.profile.role === "creator") ||
    (user && user.user && user.user.role === "creator")
  );

  // 🕒 While AuthContext is still checking tokens (loading=true)
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
  <main className="flex-grow">
      {/* Use shared HomeNavbar for consistency */}
      <HomeNavbar />

  {/* 🌟 Hero Section */}
  <section className="flex flex-col items-center justify-center text-center py-20 px-6 bg-primary-gradient text-white">
        <h2 className="text-4xl font-bold mb-3">
          Empowering Creative Minds 🎨
        </h2>
        <p className="text-lg max-w-2xl mb-8">
          Discover, support, and fund amazing ideas in film, music, and art — whether
          you're a backer or a creator, start your journey here.
        </p>

        {!user ? (
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-primary-2/10 transition"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition"
            >
              Create an Account
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/project")}
              className="bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-primary-2/10 transition"
            >
              View Projects
            </button>

            {isCreator && (
              <>
                <button
                  onClick={() => navigate("/start-project")}
                  className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-full hover:bg-yellow-300 transition"
                >
                  Start a Project
                </button>
                <button
                  onClick={() => navigate("/my-projects")}
                  className="btn-primary px-6 py-3 rounded-full"
                >
                  My Projects
                </button>
              </>
            )}
          </div>
        )}
      </section>

  {/* 📊 Platform Stats */}
      <section className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 py-16 px-6">
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-indigo-600">₹1.2L+</p>
          <p className="text-gray-600 mt-2">Total Funds Raised</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-indigo-600">120+</p>
          <p className="text-gray-600 mt-2">Projects Created</p>
        </div>
        <div className="bg-white shadow-md rounded-xl p-6 text-center">
          <p className="text-3xl font-bold text-indigo-600">500+</p>
          <p className="text-gray-600 mt-2">Active Backers</p>
        </div>
  </section>

  {/* 🧠 Featured Projects */}
      <section className="w-full max-w-6xl mx-auto mb-16 px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 shadow-lg rounded-2xl hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-2">🎬 Short Film: The Journey</h3>
            <p className="text-gray-600 text-sm mb-3">
              A heartwarming story of dreams and resilience.
            </p>
            <button
              onClick={() => navigate("/project/film/1")}
              className="text-indigo-600 font-semibold hover:underline"
            >
              View Project →
            </button>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-2xl hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-2">🎵 Indie Album: Midnight Beats</h3>
            <p className="text-gray-600 text-sm mb-3">
              Support an emerging artist’s debut music collection.
            </p>
            <button
              onClick={() => navigate("/project/music/1")}
              className="text-indigo-600 font-semibold hover:underline"
            >
              View Project →
            </button>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-2xl hover:shadow-xl transition">
            <h3 className="text-lg font-semibold mb-2">🎨 Art Series: Colors of Life</h3>
            <p className="text-gray-600 text-sm mb-3">
              A collection exploring emotions through vibrant art.
            </p>
            <button
              onClick={() => navigate("/project/art/1")}
              className="text-indigo-600 font-semibold hover:underline"
            >
              View Project →
            </button>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
