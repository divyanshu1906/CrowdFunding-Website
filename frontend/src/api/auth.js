const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function register(payload) {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function login(payload) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    // this will throw an error for 400 or 401
    throw new Error(data.detail || "Login failed");
  }

  return data;
}

export async function me(accessToken) {
  const res = await fetch(`${API_BASE}/auth/me/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  // Return null for non-authenticated responses so callers can handle it
  if (!res.ok) return null;
  return res.json();
}

export async function logout(refreshToken) {
  await fetch(`${API_BASE}/auth/logout/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
}
