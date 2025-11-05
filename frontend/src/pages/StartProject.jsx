import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function StartProject() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Restrict only creators
  if (user?.profile?.role !== "creator") {
    return (
      <div className="text-center mt-20 text-red-500">
        You are not authorized to start a project.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <h2 className="text-3xl font-semibold mb-8">Select Project Category</h2>
      <div className="flex gap-6 flex-wrap">
        <button
          onClick={() => navigate("/start-project/film")}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Film 🎬
        </button>
        <button
          onClick={() => navigate("/start-project/music")}
          className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
        >
          Music 🎵
        </button>
        <button
          onClick={() => navigate("/start-project/art")}
          className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-purple-700 transition"
        >
          Art 🎨
        </button>
      </div>
    </div>
  );
}
