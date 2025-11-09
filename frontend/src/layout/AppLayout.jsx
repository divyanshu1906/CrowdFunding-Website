import React from "react";
import { Outlet } from "react-router-dom";
import HomeNavbar from "../components/HomeNavbar";
import Footer from "../components/Footer"; // ✅ new import

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ✅ Global Navbar (protected) */}
      <HomeNavbar />

      {/* ✅ Page Content */}
      <main className="flex-grow pt-4">
        <Outlet />
      </main>

      {/* ✅ Global Footer */}
      <Footer />
    </div>
  );
}
