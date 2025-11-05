import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createArtProject } from "../api/createProject";
import ProjectFormComponent from "../components/ProjectFormComponent";

export default function Art() {
  // 🧠 Context & navigation setup
  const { access } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🧾 State: holds form data
  const [form, setForm] = useState({
    title: "",
    description: "",
    goal_amount: "",
    reward_tiers: "",
    short_video_url: "",
    artwork_images: [], // array of uploaded images
  });

  // ⚙️ UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "artwork_images") {
      setForm({ ...form, artwork_images: Array.from(files) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🧮 Parse reward tiers (₹amount = reward)
    const rewards = form.reward_tiers
      ? form.reward_tiers
          .split("\n")
          .map((line) => {
            if (!line.includes("=")) return null;
            const [place, reward] = line.split("=");
            return {
              place: place?.trim(),
              reward: reward?.trim() || "No reward specified",
            };
          })
          .filter(Boolean)
      : [];

    // 🧱 Prepare form data for backend (multipart/form-data)
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("goal_amount", form.goal_amount);
    formData.append("short_video_url", form.short_video_url);
    formData.append("reward_tiers", JSON.stringify(rewards));

    form.artwork_images.forEach((file) =>
      formData.append("artwork_images", file)
    );

    // 📡 API request to create new project
    try {
      await createArtProject(formData, access);
      alert("🎨 Art project created successfully!");
      navigate("/project");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail ||
          "Something went wrong while creating the project."
      );
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // 🧩 Render the shared base form component
  // Pass custom (art-specific) inputs as children
  // =======================================================
  return (
    <ProjectFormComponent
      category="Art"
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      {/* 🖼️ Art-specific image upload field */}
      <input
        type="file"
        name="artwork_images"
        accept="image/*"
        multiple
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
      />

      {/* 🎥 Optional video URL field */}
      <input
        type="text"
        name="short_video_url"
        placeholder="Short Video URL (optional)"
        value={form.short_video_url}
        onChange={handleChange}
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
      />
    </ProjectFormComponent>
  );
}
