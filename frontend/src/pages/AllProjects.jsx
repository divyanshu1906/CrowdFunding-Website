import React, { useEffect, useState } from "react";
import { getAllProjects } from "../api/project";
import ProjectDisplayComponent from "../components/ProjectDisplayComponent";

export default function AllProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        setProjects(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading projects...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-site-bg p-6">
      <h2 className="text-3xl font-bold text-center mb-8">All Projects</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectDisplayComponent key={`${project.category}-${project.id}`} project={project} />
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No projects found.
          </p>
        )}
      </div>
    </div>
  );
}
