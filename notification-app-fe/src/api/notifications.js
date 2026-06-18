const API_URL = "/api/notifications";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export async function fetchNotifications({ page = 1, type } = {}) {
  const query = new URLSearchParams({ page });
  if (type && type !== "All") query.append("notification_type", type);

  const res = await fetch(`${API_URL}?${query}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}