import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById, updateProject } from "../api/project";
import { AuthContext } from "../context/AuthContext";
import ProjectFormComponent from "../components/ProjectFormComponent";

export default function UpdateProject() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const { access } = useContext(AuthContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    goal_amount: "",
    reward_tiers: "",
    trailer_url: "",
    short_video_url: "",
  });
  const [file, setFile] = useState(null); // for image/file uploads
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch existing project
  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProjectById(category, id);
        setForm({
          title: data.title || "",
          description: data.description || "",
          goal_amount: data.goal_amount || "",
          trailer_url: data.trailer_url || "",
          short_video_url: data.short_video_url || "",
          reward_tiers:
            Array.isArray(data.reward_tiers)
              ? data.reward_tiers
                  .map((r) => `${r.place || ""} = ${r.reward || ""}`)
                  .join("\n")
              : "",
        });
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("Failed to load project data.");
      }
    }
    fetchProject();
  }, [category, id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const rewards = form.reward_tiers
      ? form.reward_tiers.split("\n").map((line) => {
          const [place, reward] = line.split("=");
          return { place: place?.trim(), reward: reward?.trim() };
        })
      : [];

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("goal_amount", form.goal_amount);
    formData.append("reward_tiers", JSON.stringify(rewards));

    if (category === "film" && file) formData.append("poster_image", file);
    if (category === "music" && file) formData.append("album_cover", file);
    if (category === "art" && file) formData.append("artwork_images", file);

    if (form.trailer_url) formData.append("trailer_url", form.trailer_url);
    if (form.short_video_url) formData.append("short_video_url", form.short_video_url);

    try {
      await updateProject(category, id, formData, access);
      alert("✅ Project updated successfully!");
      navigate("/my-projects");
    } catch (err) {
      console.error("Error updating project:", err);
      setError("Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Category-specific fields
  const renderCategoryFields = () => {
    switch (category) {
      case "film":
        return (
          <>
            <input
              type="url"
              name="trailer_url"
              value={form.trailer_url}
              onChange={handleChange}
              placeholder="Trailer URL (YouTube or Vimeo)"
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />
            <input
              type="file"
              name="poster_image"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />
          </>
        );

      case "music":
        return (
          <>
            <input
              type="file"
              name="album_cover"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />
            <input
              type="url"
              name="short_video_url"
              value={form.short_video_url}
              onChange={handleChange}
              placeholder="Short promo video URL"
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />
          </>
        );

      case "art":
        return (
          <>
            <input
              type="file"
              name="artwork_images"
              onChange={handleFileChange}
              accept="image/*"
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />
            <input
              type="url"
              name="short_video_url"
              value={form.short_video_url}
              onChange={handleChange}
              placeholder="Art showcase video URL"
              className="w-full mb-3 px-4 py-2 border rounded-lg"
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <ProjectFormComponent
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={loading}
        error={error}
      >
        <h3 className="text-center text-gray-600 mb-4">
          Update your {category.toUpperCase()} project details below.
        </h3>
        {renderCategoryFields()}
      </ProjectFormComponent>
    </div>
  );
}
