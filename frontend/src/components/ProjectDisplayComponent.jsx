import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProjectById } from "../api/project";
import ProjectModal from "./ProjectModal"; // ✅ new file

const ProjectDisplayComponent = ({ project }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleViewDetails = async () => {
    try {
      setLoading(true);
    const data = await getProjectById(project.category, project.id);
    console.log("Fetched project details:", data); 
      setSelectedProject(data);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      setError("Failed to load project details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
  <div className="card-surface p-5 hover:shadow-xl transition duration-300 relative">
        <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
        <p className="text-gray-700 mb-3">{project.description}</p>
        <p className="text-sm text-gray-500 mb-1">Creator: {project.creator_name}</p>
        <p className="text-sm text-gray-500 mb-1">Goal: ₹{project.goal_amount}</p>
        <p className="text-sm text-gray-500 mb-4">Raised: ₹{project.raised_amount}</p>

        {/* Thumbnail */}
        {project.poster_image && (
          <img
            src={project.poster_image}
            alt={project.title}
            className="w-full h-40 object-cover rounded-xl mb-2"
          />
        )}
        {project.album_cover && (
          <img
            src={project.album_cover}
            alt={project.title}
            className="w-full h-40 object-cover rounded-xl mb-2"
          />
        )}
        {project.artwork_images?.length > 0 && (
          <img
            src={project.artwork_images[0]}
            alt={project.title}
            className="w-full h-40 object-cover rounded-xl mb-2"
          />
        )}

        {/* Buttons */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleViewDetails}
            className="btn-primary px-4 py-2 rounded-lg hover:opacity-95 transition"
          >
            {loading ? "Loading..." : "View Details"}
          </button>
          <button
            onClick={() => navigate(`/donate/${project.category}/${project.id}`)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Make Donation
          </button>
        </div>
      </div>

      {/* Modal Component */}
      {showModal && selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default ProjectDisplayComponent;
