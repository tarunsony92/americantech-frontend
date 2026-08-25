import axiosInstance from "../api/axiosInstance";

const couponService = {
  list: () => axiosInstance.get("/admin/coupons"),
};

export default couponService;