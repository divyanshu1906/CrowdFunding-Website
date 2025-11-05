import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById } from "../api/project";

const ProjectInformation = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await getProjectById(id);
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    }
    fetchProject();
  }, [id]);

  if (!project) return <p className="p-10">Loading project details...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <p className="text-gray-700 mb-6">{project.description}</p>

      <button
        onClick={() => navigate("/project")}
        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        Back to All Projects
      </button>
    </div>
  );
};

export default ProjectInformation;
