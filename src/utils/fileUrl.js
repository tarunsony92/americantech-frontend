const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

const ROOT_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export const buildFileUrl = (relativePath) => {
  if (!relativePath) return "#";
  return `${ROOT_URL}${relativePath}`;
};