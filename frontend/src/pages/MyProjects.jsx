import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { getMyProjects } from "../api/project";
import ProjectDisplayComponent from "../components/ProjectDisplayComponent";

export default function MyProjects() {
  const { access } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const data = await getMyProjects(access);
        setProjects(data);
      } catch (err) {
        setError("Failed to load your projects.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, [access]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">My Created Projects</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectDisplayComponent
              key={`${project.category}-${project.id}`}
              project={project}
            />
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            You haven’t created any projects yet.
          </p>
        )}
      </div>
    </div>
  );
}
