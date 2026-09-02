import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import quizApi from "../../api/quizApi";

const QuizList = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    durationMinutes: "",
    passingScore: "",
    maxAttempts: 1,
  });
  const [saving, setSaving] = useState(false);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await quizApi.listQuizzesByModule(moduleId);
      setQuizzes(res.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (moduleId) fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        moduleId,
        title: form.title,
        description: form.description,
        durationMinutes: form.durationMinutes ? Number(form.durationMinutes) : null,
        passingScore: form.passingScore ? Number(form.passingScore) : 0,
        maxAttempts: form.maxAttempts ? Number(form.maxAttempts) : 1,
      };
      const res = await quizApi.createQuiz(payload);
      const newQuiz = res.data?.data;
      setShowCreate(false);
      setForm({ title: "", description: "", durationMinutes: "", passingScore: "", maxAttempts: 1 });
      await fetchQuizzes();
      if (newQuiz?.id) navigate(`/quizzes/${newQuiz.id}/edit`);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to create quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz? This cannot be undone.")) return;
    try {
      await quizApi.deleteQuiz(id);
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete quiz");
    }
  };

  const handlePublish = async (id) => {
    try {
      const res = await quizApi.publishQuiz(id);
      const updated = res.data?.data;
      setQuizzes((prev) => prev.map((q) => (q.id === id ? { ...q, status: updated.status } : q)));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to publish quiz");
    }
  };

  const statusBadge = (status) => {
    const styles = {
      draft: "bg-gray-100 text-gray-700",
      published: "bg-green-100 text-green-700",
      closed: "bg-red-100 text-red-700",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-800">Quizzes</h1>
        <button
          onClick={() => setShowCreate((prev) => !prev)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
        >
          {showCreate ? "Cancel" : "+ New Quiz"}
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Quiz title"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="number"
              name="durationMinutes"
              value={form.durationMinutes}
              onChange={handleChange}
              min="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave blank for untimed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score (%)</label>
            <input
              type="number"
              name="passingScore"
              value={form.passingScore}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Attempts</label>
            <input
              type="number"
              name="maxAttempts"
              value={form.maxAttempts}
              onChange={handleChange}
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end gap-2 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {saving ? "Saving..." : "Create Quiz"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-sm text-gray-500 py-8 text-center">Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-300 rounded-lg">
          No quizzes yet for this module.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Duration</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Passing %</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Max Attempts</th>
                <th className="text-right px-4 py-2 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{quiz.title}</td>
                  <td className="px-4 py-2">{statusBadge(quiz.status)}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {quiz.durationMinutes ? `${quiz.durationMinutes} min` : "Untimed"}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{quiz.passingScore}%</td>
                  <td className="px-4 py-2 text-gray-600">{quiz.maxAttempts}</td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/quizzes/${quiz.id}/edit`)}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Edit
                      </button>
                      {quiz.status === "draft" && (
                        <button
                          onClick={() => handlePublish(quiz.id)}
                          className="text-green-600 hover:underline text-xs font-medium"
                        >
                          Publish
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/quizzes/${quiz.id}/attempts`)}
                        className="text-gray-600 hover:underline text-xs font-medium"
                      >
                        Attempts
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="text-red-600 hover:underline text-xs font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizList;