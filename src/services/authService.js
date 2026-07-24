import axiosInstance from "../api/axiosInstance";

export const authService = {
  login: (payload) => axiosInstance.post("/auth/login", payload),
  register: (payload) => axiosInstance.post("/auth/register", payload),
  forgotPassword: (payload) => axiosInstance.post("/auth/forgot-password", payload),
  resetPassword: (payload) => axiosInstance.post("/auth/reset-password", payload),
  changePassword: (payload) => axiosInstance.post("/auth/change-password", payload),
  getProfile: () => axiosInstance.get("/auth/profile"),
  updateProfile: (payload) => axiosInstance.put("/auth/profile", payload),
  logout: (refreshToken) => axiosInstance.post("/auth/logout", { refreshToken }),
};

export default authService;
