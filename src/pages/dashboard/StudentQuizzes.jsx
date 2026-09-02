import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizApi from "../../api/quizApi";

// Student sees only published quizzes for their enrolled batch.
// enrollmentId is passed via route state or query — adjust to however
// your app tracks the student's current enrollment.
const StudentQuizzes = () => {
  const { batchId, enrollmentId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await quizApi.listQuizzesByBatch(batchId);
        const items = res?.data?.data || [];
        // students should only see published quizzes
        setQuizzes(items.filter((q) => q.status === "published"));
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    if (batchId) fetchQuizzes();
  }, [batchId]);

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading quizzes...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Quizzes</h1>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {quizzes.length === 0 ? (
        <div className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-300 rounded-lg">
          No quizzes available yet.
        </div>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
            >
              <div>
                <h2 className="font-medium text-gray-800">{quiz.title}</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {quiz.durationMinutes ? `${quiz.durationMinutes} min` : "Untimed"} ·{" "}
                  Passing: {quiz.passingScore}% · Max attempts: {quiz.maxAttempts}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate(`/dashboard/quizzes/${quiz.id}/attempt`, {
                    state: { enrollmentId },
                  })
                }
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentQuizzes;