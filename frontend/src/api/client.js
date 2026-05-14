import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("guardiao_token");
  const adminToken = localStorage.getItem("guardiao_admin_token");
  if (adminToken && config.url?.startsWith("/admin")) config.headers.Authorization = `Bearer ${adminToken}`;
  if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
