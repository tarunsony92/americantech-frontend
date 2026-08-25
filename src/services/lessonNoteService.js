import axiosInstance from "../api/axiosInstance";

const lessonNoteService = {
  list: (lessonId) => axiosInstance.get("/lesson-notes", { params: { lessonId } }),

  upload: (lessonId, file) => {
    const formData = new FormData();
    formData.append("lessonId", lessonId);
    formData.append("file", file);

    // Don't set Content-Type manually — axiosInstance's interceptor detects
    // FormData and lets the browser set the correct multipart boundary.
    return axiosInstance.post("/lesson-notes", formData);
  },

  remove: (id) => axiosInstance.delete(`/lesson-notes/${id}`),
};

export default lessonNoteService;