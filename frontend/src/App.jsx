import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

// Auth
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./layout/AppLayout";

// Public Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"; // ✅ your new landing page

// Protected Pages
import Home from "./pages/Home";
import AllProjects from "./pages/AllProjects";
import ProjectInformation from "./pages/ProjectInformation";
import Film from "./pages/Film";
import Music from "./pages/Music";
import Art from "./pages/Art";
import StartProject from "./pages/StartProject";
import MyProjects from "./pages/MyProjects";
import UpdateProject from "./pages/UpdateProject";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* 🔓 Public Routes (no navbar/footer) */}
          <Route path="/" element={<Dashboard />} />
          {/* Alias so /dashboard works after logout redirects */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔒 Protected Routes (with Navbar + Footer) */}
          <Route
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            {/* Inside AppLayout → Navbar + Footer are automatically included */}
            <Route path="/home" element={<Home />} />
            <Route path="/project" element={<AllProjects />} />
            <Route path="/project/:category/:id" element={<ProjectInformation />} />
            <Route path="/donate/:category/:id" element={<Payment />} />
            <Route path="/my-projects" element={<MyProjects />} />
            <Route path="/update-project/:category/:id" element={<UpdateProject />} />
            <Route path="/profile" element={<Profile />} />

            {/* Start Project Routes */}
            <Route path="/start-project" element={<StartProject />} />
            <Route path="/start-project/film" element={<Film />} />
            <Route path="/start-project/music" element={<Music />} />
            <Route path="/start-project/art" element={<Art />} />
          </Route>

          {/* 🚫 404 fallback */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen text-gray-500 text-xl">
                404 – Page Not Found
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
