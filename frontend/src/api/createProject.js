import axios from "axios";

const API_BASE = "http://localhost:8000/api/projects/";

export const createFilmProject = async (data, token) => {
  return axios.post(`${API_BASE}film/create/`, data, {
    headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
    },
  });
};

export const createMusicProject = async (data, token) => {
  return axios.post(`${API_BASE}music/create/`, data, {
    headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
    },
  });
};

export const createArtProject = async (data, token) => {
  return axios.post(`${API_BASE}art/create/`, data, {
    headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
    },
  });
};
