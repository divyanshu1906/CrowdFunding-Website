import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createFilmProject } from "../api/createProject";
import ProjectFormComponent from "../components/ProjectFormComponent";
import { useNavigate } from "react-router-dom";

export default function Film() {
  const { access } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    goal_amount: "",
    reward_tiers: "",
    trailer_url: "",
    poster_image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "poster_image") {
      setForm({ ...form, poster_image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

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

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("goal_amount", form.goal_amount);
    formData.append("trailer_url", form.trailer_url);
    formData.append("reward_tiers", JSON.stringify(rewards));
    if (form.poster_image) formData.append("poster_image", form.poster_image);

    try {
      await createFilmProject(formData, access);
      alert("🎬 Film project created successfully!");
      navigate("/project");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectFormComponent
      category="Film"
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      {/* 🎥 Film-specific fields */}
      <input
        type="url"
        name="trailer_url"
        placeholder="Trailer URL (YouTube or Vimeo)"
        value={form.trailer_url}
        onChange={handleChange}
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
      />

      <input
        type="file"
        name="poster_image"
        accept="image/*"
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
      />
    </ProjectFormComponent>
  );
}
