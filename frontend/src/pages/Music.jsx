import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createMusicProject } from "../api/createProject";
import ProjectFormComponent from "../components/ProjectFormComponent";

export default function Music() {
  const { access } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    goal_amount: "",
    reward_tiers: "",
    album_cover: null,
    audio_samples: [],
    short_video_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "album_cover") {
      setForm({ ...form, album_cover: files[0] });
    } else if (name === "audio_samples") {
      setForm({ ...form, audio_samples: Array.from(files) });
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

    if (form.album_cover) formData.append("album_cover", form.album_cover);
    form.audio_samples.forEach((file) => formData.append("audio_samples", file));

    try {
      await createMusicProject(formData, access);
      alert("🎵 Music project created successfully!");
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
      category="Music"
      form={form}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      loading={loading}
      error={error}
    >
      {/* 🎧 Music-specific inputs */}
      <input
        type="file"
        name="album_cover"
        accept="image/*"
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
      />

      <input
        type="file"
        name="audio_samples"
        accept="audio/*"
        multiple
        onChange={handleChange}
        required
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
      />

      <input
        type="text"
        name="short_video_url"
        placeholder="Short Video URL (optional)"
        value={form.short_video_url}
        onChange={handleChange}
        className="w-full mb-3 px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
      />
    </ProjectFormComponent>
  );
}
