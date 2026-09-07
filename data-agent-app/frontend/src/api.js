const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} — ${body}`);
  }
  return res.json();
}

export const api = {
  sendMessage: (message, sessionId = "default") =>
    request("/chat", {
      method: "POST",
      body: JSON.stringify({ message, session_id: sessionId }),
    }),
  getHistory: (limit = 50) => request(`/history?limit=${limit}`),
  getStats: () => request("/stats"),
};
