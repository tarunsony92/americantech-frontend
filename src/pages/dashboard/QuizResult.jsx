import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import quizApi from "../../api/quizApi";

const QuizResult = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [attempt, setAttempt] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [error, setError] = useState("");

  useEffect(() => {
    if (attempt) return; // already have it from navigation state

    const fetchResult = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await quizApi.getAttemptResult(attemptId);
        setAttempt(res?.data?.data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load result");
      } finally {
        setLoading(false);
      }
    };

    if (attemptId) fetchResult();
  }, [attemptId, attempt]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading result...</div>;
  }

  if (error || !attempt) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error || "Result not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <div
        className={`inline-flex items-center justify-center h-20 w-20 rounded-full mb-4 text-2xl font-bold ${
          attempt.passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}
      >
        {attempt.percentage}%
      </div>

      <h1 className="text-xl font-semibold text-gray-800 mb-1">
        {attempt.passed ? "You passed!" : "You did not pass"}
      </h1>

      <p className="text-sm text-gray-500 mb-6">
        Score: {attempt.scoredMarks} / {attempt.totalMarks}
      </p>

      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
      >
        Back to Quizzes
      </button>
    </div>
  );
};

export default QuizResult;