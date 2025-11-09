import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'backer'
  });
  const { login } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const data = await register(form);
      if (data.access) {
        login({ access: data.access, refresh: data.refresh, user: data.user });
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1200);
      } else {
        setError(data.errors || { general: 'Registration failed.' });
      }
    } catch (err) {
      setError({ general: 'Registration failed. Try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gray-50 px-4">
      {/* Top-right Login button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 bg-white hover:bg-indigo-50 transition"
        >
          Login
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left: marketing / welcome */}
        <div className="hidden md:flex flex-col items-start justify-center p-10 bg-primary-gradient text-white">
          <h1 className="text-3xl font-bold mb-2">Join CrowdFunding</h1>
          <p className="mb-6 text-primary-contrast">Create an account to back creators or start your own project — it only takes a minute.</p>
          <div className="mt-auto text-sm opacity-90">Already a member? <button onClick={() => navigate('/login')} className="underline">Sign in</button></div>
        </div>

        {/* Right: form */}
        <div className="p-8 md:p-10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Create your account</h2>
            <p className="text-sm text-gray-500 mt-1">Start supporting creators or launch your project.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-sm text-gray-700">First name</span>
                <input
                  value={form.first_name}
                  onChange={e => setForm({ ...form, first_name: e.target.value })}
                  placeholder="First name"
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </label>

              <label className="block">
                <span className="text-sm text-gray-700">Last name</span>
                <input
                  value={form.last_name}
                  onChange={e => setForm({ ...form, last_name: e.target.value })}
                  placeholder="Last name"
                  className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-sm text-gray-700">Username</span>
              <input
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="Username"
                required
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Email</span>
              <input
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                required
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Choose a strong password"
                required
                className="mt-1 block w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>

            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600">Role:</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                className="px-3 py-2 border rounded-lg"
              >
                <option value="backer">Backer</option>
                <option value="creator">Creator</option>
              </select>
            </div>

            {error && (
              <div className="mt-2 text-red-600 text-sm">
                {Object.entries(error).map(([field, messages]) => (
                  <p key={field}>
                    <strong>{field}:</strong> {Array.isArray(messages) ? messages.join(', ') : messages}
                  </p>
                ))}
              </div>
            )}

            {success && <p className="mt-2 text-green-600">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 btn-primary py-2 rounded-lg hover:opacity-95 transition"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Already have an account? <button onClick={() => navigate('/login')} className="text-indigo-600 font-medium hover:underline">Log in</button>
          </div>
        </div>
      </div>
    </div>
  );
}
