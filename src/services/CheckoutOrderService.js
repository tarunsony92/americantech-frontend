// services/CheckoutOrderService.js
import api from "../api/axiosInstance"; // adjust to your existing axios instance import

const checkoutOrderService = {
  // Saves/updates a checkout attempt in the backend, for ANY outcome:
  // status: "succeeded" | "failed" | "cancelled"
  saveOrder: (payload) => api.post("/checkout-orders", payload),

  getByPaymentIntent: (paymentIntentId) =>
    api.get(`/checkout-orders/${paymentIntentId}`),

  list: (params) => api.get("/checkout-orders", { params }),
};

export default checkoutOrderService;