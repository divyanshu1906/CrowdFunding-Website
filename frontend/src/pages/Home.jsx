import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const role = user?.profile?.role;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ✅ Hero Section */}
      <section className="bg-blue-600 text-white py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">Support Creative Projects</h1>
        <p className="text-lg mb-6">
          Discover and fund amazing ideas in film, music, and art.
        </p>

        {/* ✅ Only for creators */}
        {role === "creator" && (
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/start-project")}
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
            >
              Start a Project
            </button>

            <button
              onClick={() => navigate("/my-projects")}
              className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition"
            >
              My Created Projects
            </button>
          </div>
        )}
      </section>

      {/* ✅ Featured Projects */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center flex-grow">
        <h2 className="text-2xl font-semibold mb-8">Featured Projects</h2>

        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {[ 
            { title: "Short Film - The Journey", category: "Film 🎬" },
            { title: "Indie Album - Midnight Beats", category: "Music 🎵" },
            { title: "Art Series - Colors of Life", category: "Art 🎨" },
          ].map((proj, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold mb-2">{proj.title}</h3>
              <p className="text-gray-500 mb-4">{proj.category}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/project")}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          View All Projects
        </button>
      </section>

      
    </div>
  );
}
