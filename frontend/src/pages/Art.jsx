import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createArtProject } from "../api/createProject";
import ProjectFormComponent from "../components/ProjectFormComponent";


export default function Art() {
  const { access } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    goal_amount: "",
    reward_tiers: "",
    short_video_url: "",
    artwork_images: [],
  });

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

    const rewards = form.reward_tiers
      ? form.reward_tiers.split("\n").map((line) => {
          const [amount, reward] = line.split("=");
          return { amount: Number(amount?.trim().replace("₹", "")), reward: reward?.trim() };
        })
      : [];

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("goal_amount", form.goal_amount);
    formData.append("short_video_url", form.short_video_url);
    formData.append("reward_tiers", JSON.stringify(rewards));

    form.artwork_images.forEach((file) => formData.append("artwork_images", file));

    try {
      await createArtProject(formData, access);
      alert("🎨 Art project created successfully!");
      navigate("/project");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Something went wrong while creating the project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProjectFormComponent
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      {/* 🖼️ Art-specific inputs */}
      <input
        type="file"
        name="artwork_images"
        accept="image/*"
        multiple
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-purple-300"
      />

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
