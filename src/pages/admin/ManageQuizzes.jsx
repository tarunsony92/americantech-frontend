import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import quizApi from "../../api/quizApi";

const EMPTY_FORM = {
  title: "",
  description: "",
  durationMinutes: "",
  passingScore: "",
  maxAttempts: 1,
};

const ManageQuizzes = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await quizApi.listQuizzesByBatch(batchId);
      const items = res?.data?.data || [];
      setQuizzes(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error("Failed to load quizzes:", err);
      setQuizzes([]);
      setError(err?.response?.data?.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (batchId) fetchQuizzes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Quiz title is required.");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        batchId: Number(batchId),
        title: form.title.trim(),
        description: form.description.trim() || null,
        durationMinutes:
          form.durationMinutes !== "" ? Number(form.durationMinutes) : null,
        passingScore:
          form.passingScore !== "" ? Number(form.passingScore) : 0,
        maxAttempts:
          form.maxAttempts !== "" ? Number(form.maxAttempts) : 1,
      };

      const res = await quizApi.createQuiz(payload);
      const newQuiz = res?.data?.data;

      setForm(EMPTY_FORM);
      setShowCreate(false);
      await fetchQuizzes();

      if (newQuiz?.id) {
        navigate(`/admin/quizzes/${newQuiz.id}/edit`);
      }
    } catch (err) {
      console.error("Failed to create quiz:", err);
      setError(err?.response?.data?.message || "Failed to create quiz");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (quizId) => {
    if (!window.confirm("Delete this quiz? This cannot be undone.")) return;

    try {
      setError("");
      await quizApi.deleteQuiz(quizId);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      setError(err?.response?.data?.message || "Failed to delete quiz");
    }
  };

  const handlePublish = async (quizId) => {
    try {
      setError("");
      const res = await quizApi.publishQuiz(quizId);
      const updated = res?.data?.data;
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === quizId ? { ...q, status: updated?.status || "published" } : q
        )
      );
    } catch (err) {
      console.error("Failed to publish quiz:", err);
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
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          styles[status] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status || "draft"}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        type="button"
        onClick={() => navigate("/admin/quizzes")}
        className="mb-4 text-sm font-medium text-gray-600 hover:text-blue-600"
      >
        ← Back to Batches
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Batch Quizzes</h1>
          <p className="text-sm text-gray-500 mt-1">Batch ID: {batchId}</p>
        </div>

        <button
          type="button"
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
          className="mb-6 p-5 border border-gray-200 rounded-lg bg-white shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter quiz title"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Optional description"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="durationMinutes"
              value={form.durationMinutes}
              onChange={handleChange}
              min="0"
              placeholder="Optional"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passing Score (%)
            </label>
            <input
              type="number"
              name="passingScore"
              value={form.passingScore}
              onChange={handleChange}
              min="0"
              max="100"
              placeholder="0"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Attempts
            </label>
            <input
              type="number"
              name="maxAttempts"
              value={form.maxAttempts}
              onChange={handleChange}
              min="1"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {saving ? "Creating..." : "Create Quiz"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-sm text-gray-500 py-8 text-center">Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-300 rounded-lg">
          <p>No quizzes found for this batch.</p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="mt-3 text-sm font-medium text-blue-600 hover:underline"
          >
            + Create the first quiz
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Duration</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Passing %</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Attempts</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{quiz.title}</td>
                  <td className="px-4 py-3">{statusBadge(quiz.status)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {quiz.durationMinutes ? `${quiz.durationMinutes} min` : "Untimed"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{quiz.passingScore ?? 0}%</td>
                  <td className="px-4 py-3 text-gray-600">{quiz.maxAttempts ?? 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}
                        className="text-blue-600 hover:underline text-xs font-medium"
                      >
                        Edit
                      </button>

                      {quiz.status === "draft" && (
                        <button
                          type="button"
                          onClick={() => handlePublish(quiz.id)}
                          className="text-green-600 hover:underline text-xs font-medium"
                        >
                          Publish
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => navigate(`/admin/quizzes/${quiz.id}/attempts`)}
                        className="text-gray-600 hover:underline text-xs font-medium"
                      >
                        Attempts
                      </button>

                      <button
                        type="button"
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

export default ManageQuizzes;