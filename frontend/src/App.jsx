import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AllProjects from "./pages/AllProjects"; // ✅ All projects list
import ProjectInformation from "./pages/ProjectInformation"; // ✅ Specific project details
import Film from "./pages/Film"; // ✅ Start project - Film
import Music from "./pages/Music"; // ✅ Start project - Music
import Art from "./pages/Art"; // ✅ Start project - Art
import StartProject from "./pages/StartProject"; // ✅ Categories selection page
import MyProjects from "./pages/MyProjects";
import { AuthProvider, AuthContext } from "./context/AuthContext";

function PrivateRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* ✅ Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/project"
            element={
              <PrivateRoute>
                <AllProjects />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-projects" 
            element={
              <PrivateRoute>
                <MyProjects />
              </PrivateRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <PrivateRoute>
                <ProjectInformation />
              </PrivateRoute>
            }
          />

          {/* ✅ Start Project Routes */}
          <Route
            path="/start-project"
            element={
              <PrivateRoute>
                <StartProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/start-project/film"
            element={
              <PrivateRoute>
                <Film />
              </PrivateRoute>
            }
          />
          <Route
            path="/start-project/music"
            element={
              <PrivateRoute>
                <Music />
              </PrivateRoute>
            }
          />
          <Route
            path="/start-project/art"
            element={
              <PrivateRoute>
                <Art />
              </PrivateRoute>
            }
          />

          {/* 🔓 Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
