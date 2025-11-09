import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMyProjects } from "../api/project";


export default function Profile() {
  const { user, access } = useContext(AuthContext);
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const role = user?.profile?.role || "User";
  const defaultAvatar = "https://www.w3schools.com/howto/img_avatar.png";

  useEffect(() => {
    const fetchProjects = async () => {
      if (role === "creator" && access) {
        try {
          const data = await getMyProjects(access);
          setMyProjects(data);
        } catch (error) {
          console.error("Error fetching user projects:", error);
        }
      }
      setLoading(false);
    };
    fetchProjects();
  }, [role, access]);

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* ✅ Profile Header */}
        <div className="bg-white shadow-lg rounded-xl p-8 flex items-center gap-6 mb-10">
          <img
            src={user.profile?.profile_image || defaultAvatar}
            alt="Profile"
            className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
            <p className="text-gray-600 capitalize">🎭 {role}</p>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-400 mt-1">
              Joined on {new Date(user.date_joined).toLocaleDateString()}
            </p>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
            Edit Profile
          </button>
        </div>

        {/* ✅ Bio Section */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-10">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">About Me</h2>
          <p className="text-gray-600">
            {user.profile?.bio || "You haven’t added a bio yet."}
          </p>
        </div>

        {/* ✅ My Projects Section (only for creators) */}
        {role === "creator" && (
          <div className="bg-white shadow-md rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              My Created Projects
            </h2>

            {loading ? (
              <p className="text-gray-500">Loading your projects...</p>
            ) : myProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {myProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-5 border rounded-xl shadow-sm hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize mb-2">
                      Category: {project.category}
                    </p>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {project.description?.slice(0, 80) || "No description"}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">
                        Created on{" "}
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                      <a
                        href={`/update-project/${project.category}/${project.id}`}
                        className="text-blue-600 font-semibold hover:underline text-sm"
                      >
                        Edit
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven’t created any projects yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
