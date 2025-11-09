import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginApi(form);

      if (data.access) {
        // Fallback if user info is not nested under 'user'
        const userData = data.user || {
          id: data.id,
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        };

        login({
          access: data.access,
          refresh: data.refresh,
          user: {
            id: data.id,
            username: data.username,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            role: data.role,
          },
        });

        alert(data.message || "Login successful!");
        navigate("/"); // ✅ redirect to homepage
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-50 px-4">
      {/* Top-right Register button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => navigate('/register')}
          className="px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50 transition"
        >
          Register
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: marketing / welcome */}
        <div className="hidden md:flex flex-col items-start justify-center p-10 bg-primary-gradient text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="mb-6 text-primary-contrast">Log in to continue supporting creators and managing your projects.</p>
          <div className="mt-auto text-sm opacity-90">Need help? <a href="#" className="underline">Contact support</a></div>
        </div>

        {/* Right: form */}
        <div className="p-8 md:p-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Sign in to your account</h2>
              <p className="text-sm text-gray-500 mt-1">Enter your credentials to access your dashboard.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-700">Username or Email</span>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="you@example.com"
                required
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="********"
                required
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center text-sm">
                <input type="checkbox" className="form-checkbox h-4 w-4 text-indigo-600" />
                <span className="ml-2 text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-indigo-600 hover:underline">Forgot password?</button>
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2 rounded-lg hover:opacity-95 transition"
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account? <button onClick={() => navigate('/register')} className="text-primary font-medium hover:underline">Create one</button>
          </div>
        </div>
      </div>
    </div>
  );
}
