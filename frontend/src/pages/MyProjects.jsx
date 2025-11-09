import React, { useEffect, useState, useContext } from "react";
import { getMyProjects, deleteProject } from "../api/project";
import { AuthContext } from "../context/AuthContext";
import ProjectModal from "../components/ProjectModal";
import { useNavigate } from "react-router-dom";

export default function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { access } = useContext(AuthContext);
  useEffect(() => {
    async function fetchMyProjects() {
      try {
        const data = await getMyProjects(access); // ✅ use access, not user.access
        setProjects(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (access) fetchMyProjects();
  }, [access]);

  const handleDelete = async (category, id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await deleteProject(category.toLowerCase(), id, access);

      // ✅ remove the project immediately from the UI
      setProjects((prevProjects) =>
        prevProjects.filter((p) => !(p.id === id && p.category === category))
      );

      alert("Project deleted successfully!");
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Failed to delete project.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-site-bg p-6">
      <h2 className="text-3xl font-bold text-center mb-8">
        My Created Projects
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
            <div
                key={project.id}
                className="card-surface p-5 hover:shadow-xl transition duration-300 relative"
              >
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
            <p className="text-gray-700 mb-3">{project.description}</p>
            <p className="text-sm text-gray-500 mb-1">
              Goal: ₹{project.goal_amount}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Raised: ₹{project.raised_amount}
            </p>

            {(project.poster_image || project.album_cover) && (
              <img
                src={project.poster_image || project.album_cover}
                alt={project.title}
                className="w-full h-40 object-cover rounded-xl mb-2"
              />
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setSelectedProject(project)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                View
              </button>
              <button
                onClick={() =>
                  navigate(`/update-project/${project.category}/${project.id}`)
                }
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(project.category, project.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
