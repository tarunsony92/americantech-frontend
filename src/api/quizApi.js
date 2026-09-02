
import axiosInstance from "./axiosInstance";

const quizApi = {
  // =========================================================
  // QUIZ
  // =========================================================

  createQuiz: (payload) =>
    axiosInstance.post("/quizzes", payload),

  listQuizzesByBatch: (batchId) =>
    axiosInstance.get(`/quizzes/batch/${batchId}`),

  getQuiz: (id, includeAnswers = false) =>
    axiosInstance.get(`/quizzes/${id}`, {
      params: { includeAnswers },
    }),

  updateQuiz: (id, payload) =>
    axiosInstance.put(`/quizzes/${id}`, payload),

  deleteQuiz: (id) =>
    axiosInstance.delete(`/quizzes/${id}`),

  publishQuiz: (id) =>
    axiosInstance.patch(`/quizzes/${id}/publish`),

  // =========================================================
  // QUESTIONS
  // =========================================================

  addQuestion: (quizId, payload) =>
    axiosInstance.post(
      `/quizzes/${quizId}/questions`,
      payload
    ),

  updateQuestion: (questionId, payload) =>
    axiosInstance.put(
      `/quizzes/questions/${questionId}`,
      payload
    ),

  deleteQuestion: (questionId) =>
    axiosInstance.delete(
      `/quizzes/questions/${questionId}`
    ),

  // =========================================================
  // OPTIONS
  // =========================================================

  updateOption: (optionId, payload) =>
    axiosInstance.put(
      `/quizzes/options/${optionId}`,
      payload
    ),

  deleteOption: (optionId) =>
    axiosInstance.delete(
      `/quizzes/options/${optionId}`
    ),

  // =========================================================
  // ADMIN ATTEMPTS
  // =========================================================

  listAttemptsByQuiz: (quizId) =>
    axiosInstance.get(
      `/quizzes/${quizId}/attempts`
    ),

  // =========================================================
  // STUDENT ATTEMPTS
  // =========================================================

  startAttempt: (quizId, enrollmentId) =>
    axiosInstance.post(
      `/quizzes/${quizId}/attempts/start`,
      { enrollmentId }
    ),

  listMyAttempts: (quizId, enrollmentId) =>
    axiosInstance.get(
      `/quizzes/${quizId}/attempts/mine`,
      {
        params: { enrollmentId },
      }
    ),

  saveAnswer: (
    attemptId,
    questionId,
    payload
  ) =>
    axiosInstance.put(
      `/quizzes/attempts/${attemptId}/questions/${questionId}/answer`,
      payload
    ),

  submitAttempt: (attemptId) =>
    axiosInstance.post(
      `/quizzes/attempts/${attemptId}/submit`
    ),

  getAttemptResult: (attemptId) =>
    axiosInstance.get(
      `/quizzes/attempts/${attemptId}/result`
    ),
};

export default quizApi;
