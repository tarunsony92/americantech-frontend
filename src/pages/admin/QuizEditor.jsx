import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizApi from "../../api/quizApi";
import QuestionForm from "../../components/admin/QuestionForm";

const emptyQuestionDraft = {
  questionText: "",
  questionType: "single",
  marks: 1,
  options: [
    { optionText: "", isCorrect: true },
    { optionText: "", isCorrect: false },
  ],
};

const emptyBasicInfoDraft = {
  title: "",
  description: "",
  durationMinutes: "",
  passingScore: "",
  maxAttempts: "",
};

const QuizEditor = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // question object or null (new)

  const [showBasicInfoForm, setShowBasicInfoForm] = useState(false);
  const [basicInfoDraft, setBasicInfoDraft] = useState(emptyBasicInfoDraft);
  const [savingBasicInfo, setSavingBasicInfo] = useState(false);

  const fetchQuiz = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await quizApi.getQuiz(quizId, true); // includeAnswers=true so editor sees correct options
      setQuiz(res.data?.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) fetchQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 2500);
  };

  const handleAddQuestion = async (draft) => {
    try {
      await quizApi.addQuestion(quizId, draft);
      setShowQuestionForm(false);
      setEditingQuestion(null);
      await fetchQuiz();
      flashSuccess("Question added");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add question");
    }
  };

  const handleUpdateQuestion = async (questionId, draft) => {
    try {
      await quizApi.updateQuestion(questionId, {
        questionText: draft.questionText,
        questionType: draft.questionType,
        marks: draft.marks,
      });

      // Sync options: update existing ones, ignore brand-new ones added during edit
      // (new options during edit of an existing question aren't supported by the backend's
      // updateOption/deleteOption routes alone — add them as a new question instead if needed)
      await Promise.all(
        draft.options
          .filter((opt) => opt.id)
          .map((opt) =>
            quizApi.updateOption(opt.id, {
              optionText: opt.optionText,
              isCorrect: opt.isCorrect,
            })
          )
      );

      setShowQuestionForm(false);
      setEditingQuestion(null);
      await fetchQuiz();
      flashSuccess("Question updated");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update question");
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Delete this question and its options?")) return;
    try {
      await quizApi.deleteQuestion(questionId);
      await fetchQuiz();
      flashSuccess("Question deleted");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete question");
    }
  };

  const handleDeleteOption = async (optionId) => {
    try {
      await quizApi.deleteOption(optionId);
      await fetchQuiz();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete option");
    }
  };

  const handlePublish = async () => {
    try {
      const res = await quizApi.publishQuiz(quizId);
      setQuiz((prev) => ({ ...prev, status: res.data?.data?.status }));
      flashSuccess("Quiz published");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to publish quiz");
    }
  };

  const openNewQuestionForm = () => {
    setEditingQuestion(null);
    setShowQuestionForm(true);
  };

  const openEditQuestionForm = (question) => {
    setEditingQuestion(question);
    setShowQuestionForm(true);
  };

  const openBasicInfoForm = () => {
    setBasicInfoDraft({
      title: quiz.title || "",
      description: quiz.description || "",
      durationMinutes: quiz.durationMinutes ?? "",
      passingScore: quiz.passingScore ?? "",
      maxAttempts: quiz.maxAttempts ?? "",
    });
    setShowBasicInfoForm(true);
  };

  const handleBasicInfoChange = (field, value) => {
    setBasicInfoDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveBasicInfo = async (e) => {
    e.preventDefault();

    if (!basicInfoDraft.title.trim()) {
      setError("Quiz title is required");
      return;
    }

    setSavingBasicInfo(true);
    setError("");
    try {
      const payload = {
        title: basicInfoDraft.title.trim(),
        description: basicInfoDraft.description || null,
        durationMinutes:
          basicInfoDraft.durationMinutes === "" ? null : Number(basicInfoDraft.durationMinutes),
        passingScore:
          basicInfoDraft.passingScore === "" ? 0 : Number(basicInfoDraft.passingScore),
        maxAttempts:
          basicInfoDraft.maxAttempts === "" ? 1 : Number(basicInfoDraft.maxAttempts),
      };

      const res = await quizApi.updateQuiz(quizId, payload);
      setQuiz((prev) => ({ ...prev, ...res.data?.data }));
      setShowBasicInfoForm(false);
      flashSuccess("Quiz details updated");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update quiz details");
    } finally {
      setSavingBasicInfo(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="p-6 text-sm text-red-600">{error || "Quiz not found"}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:underline mb-4">
        ← Back
      </button>

      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{quiz.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {quiz.status === "draft" ? "Draft" : quiz.status === "published" ? "Published" : "Closed"} ·{" "}
            {quiz.questions?.length || 0} question(s)
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={openBasicInfoForm}
            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition"
          >
            Edit Details
          </button>
          {quiz.status === "draft" && (
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition"
            >
              Publish Quiz
            </button>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-6 flex gap-4">
        <span>{quiz.durationMinutes ? `${quiz.durationMinutes} min` : "Untimed"}</span>
        <span>Passing: {quiz.passingScore}%</span>
        <span>Max attempts: {quiz.maxAttempts}</span>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-md">
          {success}
        </div>
      )}

      {showBasicInfoForm && (
        <form
          onSubmit={handleSaveBasicInfo}
          className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm mb-6 space-y-4"
        >
          <h2 className="text-sm font-semibold text-gray-700">Quiz Details</h2>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
            <input
              type="text"
              value={basicInfoDraft.title}
              onChange={(e) => handleBasicInfoChange("title", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea
              value={basicInfoDraft.description}
              onChange={(e) => handleBasicInfoChange("description", e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min="0"
                value={basicInfoDraft.durationMinutes}
                onChange={(e) => handleBasicInfoChange("durationMinutes", e.target.value)}
                placeholder="Untimed"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Passing Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={basicInfoDraft.passingScore}
                onChange={(e) => handleBasicInfoChange("passingScore", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Max Attempts
              </label>
              <input
                type="number"
                min="1"
                value={basicInfoDraft.maxAttempts}
                onChange={(e) => handleBasicInfoChange("maxAttempts", e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowBasicInfoForm(false)}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={savingBasicInfo}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {savingBasicInfo ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-gray-700">Questions</h2>
        <button
          onClick={openNewQuestionForm}
          className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition"
        >
          + Add Question
        </button>
      </div>

      {showQuestionForm && (
        <QuestionForm
          initialData={editingQuestion || emptyQuestionDraft}
          isEditing={!!editingQuestion}
          onCancel={() => {
            setShowQuestionForm(false);
            setEditingQuestion(null);
          }}
          onSubmit={(draft) =>
            editingQuestion ? handleUpdateQuestion(editingQuestion.id, draft) : handleAddQuestion(draft)
          }
        />
      )}

      <div className="space-y-3 mt-4">
        {(quiz.questions || []).length === 0 && !showQuestionForm && (
          <div className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-300 rounded-lg">
            No questions yet. Add your first question above.
          </div>
        )}

        {(quiz.questions || []).map((q, idx) => (
          <div key={q.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {idx + 1}. {q.questionText}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {q.questionType === "single" ? "Single correct" : "Multiple correct"} · {q.marks} mark(s)
                </p>
              </div>
              <div className="flex gap-2 shrink-0 ml-4">
                <button
                  onClick={() => openEditQuestionForm(q)}
                  className="text-blue-600 hover:underline text-xs font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteQuestion(q.id)}
                  className="text-red-600 hover:underline text-xs font-medium"
                >
                  Delete
                </button>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5">
              {(q.options || []).map((opt) => (
                <li
                  key={opt.id}
                  className={`flex items-center justify-between text-sm px-3 py-1.5 rounded-md border ${
                    opt.isCorrect ? "border-green-300 bg-green-50 text-green-800" : "border-gray-200 text-gray-700"
                  }`}
                >
                  <span>{opt.optionText}</span>
                  <div className="flex items-center gap-2">
                    {opt.isCorrect && <span className="text-xs font-medium">Correct</span>}
                    <button
                      onClick={() => handleDeleteOption(opt.id)}
                      className="text-gray-400 hover:text-red-600 text-xs"
                      title="Delete option"
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizEditor;