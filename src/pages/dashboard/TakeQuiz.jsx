import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import quizApi from "../../api/quizApi";

const TakeQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const enrollmentId = location.state?.enrollmentId;

  const [quiz, setQuiz] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: optionId | [optionIds] }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false); // true when attempt could not be started
  const [timeLeft, setTimeLeft] = useState(null); // seconds

  // Load quiz + start (or resume) attempt
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError("");
      setBlocked(false);
      try {
        if (!enrollmentId) {
          setError("Missing enrollment info. Go back and open this quiz from your course page.");
          setBlocked(true);
          return;
        }

        const quizRes = await quizApi.getQuiz(quizId); // includeAnswers stays false for students
        const quizData = quizRes?.data?.data;
        setQuiz(quizData);

        try {
          const attemptRes = await quizApi.startAttempt(quizId, enrollmentId);
          const attemptData = attemptRes?.data?.data;
          setAttempt(attemptData);

          if (quizData?.durationMinutes && attemptData?.startedAt) {
            const deadline =
              new Date(attemptData.startedAt).getTime() +
              quizData.durationMinutes * 60000;
            setTimeLeft(Math.max(0, Math.floor((deadline - Date.now()) / 1000)));
          }
        } catch (attemptErr) {
          // Quiz loaded fine, but attempt could not be started
          // (e.g. max attempts reached, quiz not published, batch mismatch, etc.)
          setError(
            attemptErr?.response?.data?.message || "Unable to start this quiz"
          );
          setBlocked(true);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load quiz");
        setBlocked(true);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) init();
  }, [quizId, enrollmentId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const questions = quiz?.questions || [];
  const currentQuestion = questions[currentIndex];

  const handleSelectSingle = (questionId, optionId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleToggleMultiple = (questionId, optionId) => {
    setAnswers((prev) => {
      const existing = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      const next = existing.includes(optionId)
        ? existing.filter((id) => id !== optionId)
        : [...existing, optionId];
      return { ...prev, [questionId]: next };
    });
  };

  const saveCurrentAnswer = useCallback(async () => {
    if (!currentQuestion || !attempt) return;

    const value = answers[currentQuestion.id];
    if (value === undefined) return; // nothing selected yet, nothing to save

    setSaving(true);
    try {
      const payload =
        currentQuestion.questionType === "single"
          ? { selectedOptionId: value }
          : { selectedOptionIds: value };

      await quizApi.saveAnswer(attempt.id, currentQuestion.id, payload);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save answer");
    } finally {
      setSaving(false);
    }
  }, [attempt, currentQuestion, answers]);

  const goNext = async () => {
    await saveCurrentAnswer();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = async () => {
    await saveCurrentAnswer();
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleSubmit = async () => {
    if (!attempt) return;
    setSubmitting(true);
    setError("");
    try {
      await saveCurrentAnswer();
      const res = await quizApi.submitAttempt(attempt.id);
      const result = res?.data?.data;
      navigate(`/dashboard/quizzes/${quizId}/result/${attempt.id}`, {
        state: { result },
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading quiz...</div>;
  }

  // Quiz couldn't be opened for attempt reasons (max attempts, not published, etc.)
  if (blocked || !attempt) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        {quiz?.title && (
          <h1 className="text-lg font-semibold text-gray-800 mb-3">{quiz.title}</h1>
        )}
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error || "This quiz is not available right now."}
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          ← Go back
        </button>
      </div>
    );
  }

  if (!currentQuestion) {
    return <div className="p-6 text-sm text-gray-500">This quiz has no questions.</div>;
  }

  const selectedValue = answers[currentQuestion.id];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold text-gray-800">{quiz.title}</h1>
        {timeLeft !== null && (
          <span
            className={`text-sm font-mono font-semibold px-3 py-1 rounded-md ${
              timeLeft < 60 ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
            }`}
          >
            {formatTime(timeLeft)}
          </span>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Question {currentIndex + 1} of {questions.length}
      </p>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm mb-6">
        <p className="text-sm font-medium text-gray-800 mb-4">
          {currentQuestion.questionText}
        </p>

        <div className="space-y-2">
          {(currentQuestion.options || []).map((opt) => {
            const isSingle = currentQuestion.questionType === "single";
            const isChecked = isSingle
              ? selectedValue === opt.id
              : Array.isArray(selectedValue) && selectedValue.includes(opt.id);

            return (
              <label
                key={opt.id}
                className={`flex items-center gap-2 border rounded-md px-3 py-2 text-sm cursor-pointer ${
                  isChecked ? "border-blue-400 bg-blue-50" : "border-gray-200"
                }`}
              >
                <input
                  type={isSingle ? "radio" : "checkbox"}
                  name={`question-${currentQuestion.id}`}
                  checked={isChecked}
                  onChange={() =>
                    isSingle
                      ? handleSelectSingle(currentQuestion.id, opt.id)
                      : handleToggleMultiple(currentQuestion.id, opt.id)
                  }
                />
                {opt.optionText}
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentIndex === 0 || saving}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 disabled:opacity-40 transition"
        >
          ← Previous
        </button>

        {currentIndex < questions.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            disabled={saving}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {saving ? "Saving..." : "Next →"}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-60 transition"
          >
            {submitting ? "Submitting..." : "Submit Quiz"}
          </button>
        )}
      </div>
    </div>
  );
};

export default TakeQuiz;