import React, { useState, useContext } from 'react';
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const data = await register(form);
    if (data.access) {
      login({ access: data.access, refresh: data.refresh, user: data.user });
      setSuccess('Registration successful!');
    } else {
      setError(data.errors || { general: 'Registration failed.' });
    }
  }

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <input
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          placeholder="Username"
          required
        />
        <input
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          placeholder="Password (min 8 chars)"
          required
        />
        <input
          value={form.first_name}
          onChange={e => setForm({ ...form, first_name: e.target.value })}
          placeholder="First Name"
        />
        <input
          value={form.last_name}
          onChange={e => setForm({ ...form, last_name: e.target.value })}
          placeholder="Last Name"
        />
        <select
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="backer">Backer</option>
          <option value="creator">Creator</option>
        </select>

        <button type="submit">Register</button>
      </form>

      {/* ✅ Display error messages */}
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {Object.entries(error).map(([field, messages]) => (
            <p key={field}>
              {field}: {Array.isArray(messages) ? messages.join(', ') : messages}
            </p>
          ))}
        </div>
      )}

      {/* ✅ Display success message */}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}
