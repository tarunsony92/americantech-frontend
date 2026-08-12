import axiosInstance from "../../api/axiosInstance";

// Matches backend routes/couponRoutes.js
// Admin CRUD: /admin/coupons
// Checkout validation: /coupons/validate

export const getCoupons = async () => {
  const { data } = await axiosInstance.get("/admin/coupons");
  return data.data;
};

export const getCoupon = async (id) => {
  const { data } = await axiosInstance.get(`/admin/coupons/${id}`);
  return data.data;
};

export const createCoupon = async (payload) => {
  const { data } = await axiosInstance.post("/admin/coupons", payload);
  return data.data;
};

export const updateCoupon = async (id, payload) => {
  const { data } = await axiosInstance.put(`/admin/coupons/${id}`, payload);
  return data.data;
};

export const deleteCoupon = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/coupons/${id}`);
  return data;
};

// courseId + orderAmount required; code is the coupon string user typed at checkout
export const validateCoupon = async ({ code, courseId, orderAmount }) => {
  const { data } = await axiosInstance.post("/coupons/validate", {
    code,
    courseId,
    orderAmount,
  });
  return data.data;
};