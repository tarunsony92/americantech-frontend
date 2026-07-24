import axiosInstance from "../api/axiosInstance";

export const contactService = {
  submit: (payload) => axiosInstance.post("/contact-queries", payload),
  subscribeNewsletter: (payload) => axiosInstance.post("/newsletters", payload),
};
export default contactService;
