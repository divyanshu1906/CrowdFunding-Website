import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function StartProject() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Restrict only creators
  if (user?.profile?.role !== "creator") {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
        <div className="text-center bg-white shadow-md rounded-2xl p-8 border border-gray-100">
          <h2 className="text-xl font-semibold text-red-600 mb-2">
            Access Denied 🚫
          </h2>
          <p className="text-gray-600">
            You are not authorized to start a project.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col items-center justify-center px-6 py-4">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-700 mb-2">
          Start Your Creative Project
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a category below to begin your journey ✨
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Film */}
        <div
          onClick={() => navigate("/start-project/film")}
          className="cursor-pointer bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center border border-transparent hover:border-indigo-500 hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <div className="text-6xl mb-4">🎬</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Film</h3>
          <p className="text-gray-500 text-center">
            Bring your stories to life with our film project category.
          </p>
        </div>

        {/* Music */}
        <div
          onClick={() => navigate("/start-project/music")}
          className="cursor-pointer bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center border border-transparent hover:border-green-500 hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <div className="text-6xl mb-4">🎵</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Music</h3>
          <p className="text-gray-500 text-center">
            Fund your musical passion — albums, singles, or performances.
          </p>
        </div>

        {/* Art */}
        <div
          onClick={() => navigate("/start-project/art")}
          className="cursor-pointer bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center border border-transparent hover:border-purple-500 hover:shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Art</h3>
          <p className="text-gray-500 text-center">
            Showcase your creativity through visual and digital art projects.
          </p>
        </div>
      </div>
    </div>
  );
}
