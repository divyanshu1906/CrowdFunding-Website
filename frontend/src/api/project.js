import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";
const API_BASE_URL = `${BASE_URL}/api`; // Django backend URL

// ✅ Helper function to fix relative media URLs safely
const fixUrl = (url) => {
  if (!url) return null; // null, undefined, or empty
  if (typeof url !== "string") {
    // handle object types (like { file: "..." } or { image: "..." })
    url = url.file || url.image || "";
  }
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_URL}${url}`;
};

// ✅ Fix all media URLs inside one project
const fixMediaUrls = (project) => ({
  ...project,
  poster_image: fixUrl(project.poster_image),
  album_cover: fixUrl(project.album_cover),
  short_video_url: fixUrl(project.short_video_url),
  trailer_url: fixUrl(project.trailer_url),
  artwork_images: Array.isArray(project.artwork_images)
    ? project.artwork_images.map((img) => fixUrl(img.image || img))
    : [],
  audio_samples: Array.isArray(project.audio_samples)
    ? project.audio_samples.map((sample) => fixUrl(sample.file || sample))
    : [],
});

// ✅ Get all projects
export const getAllProjects = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/`);
    // Fix URLs for each project
    const projects = response.data.map((proj) => fixMediaUrls(proj));
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
};

// ✅ Get a single project by ID
export const getProjectById = async (category, id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/${category}/${id}/`);
    return fixMediaUrls(response.data);
  } catch (error) {
    console.error(`Error fetching ${category} project with ID ${id}:`, error);
    throw error;
  }
};

export const getMyProjects = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/projects/my/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.map(fixMediaUrls);
  } catch (error) {
    console.error("Error fetching my projects:", error);
    throw error;
  }
};

export const updateProject = async (category, id, formData, token) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/projects/my/${category}/${id}/update/`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};
export const deleteProject = async (category, id, token) => {
  try {
    await axios.delete(`${API_BASE_URL}/projects/my/${category}/${id}/delete/`, {
      
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};
