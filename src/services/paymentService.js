import axiosInstance from "../api/axiosInstance";

const paymentService = {
  createPaymentIntent: (payload) =>
    axiosInstance.post("/payment/create-payment-intent", payload),
};

export default paymentService;