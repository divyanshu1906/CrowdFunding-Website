// src/components/ProjectModal.jsx
import React from "react";

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl relative animate-fadeIn"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-2 text-indigo-700">{project.title}</h2>
        <p className="text-gray-700 mb-4">{project.description}</p>
        <p className="text-sm text-gray-500 mb-2">Goal: ₹{project.goal_amount}</p>
        <p className="text-sm text-gray-500 mb-4">Raised: ₹{project.raised_amount}</p>

        {/* Images / Media */}
        {project.poster_image && (
          <img
            src={project.poster_image}
            alt={project.title}
            className="w-full h-60 object-cover rounded-xl mb-4"
          />
        )}

        {project.album_cover && (
          <img
            src={project.album_cover}
            alt={project.title}
            className="w-full h-60 object-cover rounded-xl mb-4"
          />
        )}

        {project.artwork_images?.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {project.artwork_images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Artwork ${i}`}
                className="w-full h-40 object-cover rounded-xl"
              />
            ))}
          </div>
        )}

        {project.short_video_url && (
          <video controls className="w-full rounded-xl mt-2">
            <source src={project.short_video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;
