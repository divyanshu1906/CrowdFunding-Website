import React from "react";

/**
 * Base form for project creation.
 * Shared across Film, Music, and Art projects.
 * Each category component (Film.jsx, Music.jsx, Art.jsx) extends this form.
 */
const ProjectFormComponent = ({ category, form, handleChange, handleSubmit, loading, error, children }) => {
  
  return (
    <form
      onSubmit={handleSubmit} 
      encType="multipart/form-data"
      className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">
        Create New {category} Project
      </h2>

      {/* 🧩 BaseProject common fields */}
      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Project Title"
        value={form.title}
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
      />

      {/* Goal Amount */}
      <input
        type="number"
        name="goal_amount"
        placeholder="Goal Amount (₹)"
        value={form.goal_amount}
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
      />

      {/* Description */}
      <textarea
        name="description"
        placeholder="Project Description"
        value={form.description}
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
      />

      {/* Reward Tiers */}
      <textarea
        name="reward_tiers"
        placeholder={`Reward Tiers (one per line, e.g. "₹500 = early access to project")`}
        value={form.reward_tiers}
        onChange={handleChange}
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
      />

      {/* ⚙️ Children: category-specific inputs (Film, Music, Art) */}
      {children}

      {/* Error message */}
      {error && <p className="text-red-500 text-center mb-3">{error}</p>}

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        {loading ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
};

export default ProjectFormComponent;
