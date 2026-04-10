import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Helper to attach token
const authHeader = () => ({
  headers: { Authorization: "Bearer " + localStorage.getItem("token") }
});

// ---------------- AUTH ----------------
export const login = async ({ email, password }) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return res.data;
};

export const register = async ({ name, email, password }) => {
  const res = await axios.post(`${BASE_URL}/auth/register`, { name, email, password });
  return res.data;
};

// ---------------- UPLOAD ----------------
export const uploadFile = async (formData) => {
  const res = await axios.post(`${BASE_URL}/uploads/upload`, formData, authHeader());
  return res.data;
};

export const getHistory = async () => {
  const res = await axios.get(`${BASE_URL}/uploads/history`, authHeader());
  return res.data;
};

// ---------------- DASHBOARDS ----------------
export const saveDashboard = async (data) => {
  const res = await axios.post(`${BASE_URL}/dashboards/save`, data, authHeader());
  return res.data;
};

export const getDashboards = async () => {
  const res = await axios.get(`${BASE_URL}/dashboards`, authHeader());
  return res.data;
};

export const deleteDashboard = async (id) => {
  const res = await axios.delete(`${BASE_URL}/dashboards/${id}`, authHeader());
  return res.data;
};

// ---------------- ADMIN ----------------
export const getAllUploads = async () => {
  const res = await axios.get(`${BASE_URL}/uploads/all`, authHeader());
  return res.data;
};

// ---------------- AI INSIGHTS ----------------
export const generateInsights = async (id) => {
  const res = await axios.post(`${BASE_URL}/insights/generate-insights/${id}`, {}, authHeader());
  return res.data;
};