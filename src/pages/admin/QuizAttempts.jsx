import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import quizApi from "../../api/quizApi";

const QuizAttempts = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [quizRes, attemptsRes] = await Promise.all([
        quizApi.getQuiz(quizId),
        quizApi.listAttemptsByQuiz(quizId),
      ]);
      setQuiz(quizRes.data?.data);
      setAttempts(attemptsRes.data?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load attempts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (quizId) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const filteredAttempts =
    statusFilter === "all" ? attempts : attempts.filter((a) => a.status === statusFilter);

  const stats = {
    total: attempts.length,
    evaluated: attempts.filter((a) => a.status === "evaluated").length,
    passed: attempts.filter((a) => a.passed).length,
    inProgress: attempts.filter((a) => a.status === "in_progress").length,
  };

  const statusBadge = (status) => {
    const styles = {
      in_progress: "bg-yellow-100 text-yellow-700",
      submitted: "bg-blue-100 text-blue-700",
      evaluated: "bg-green-100 text-green-700",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading attempts...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:underline mb-4">
        ← Back
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Attempts — {quiz?.title || "Quiz"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Passing score: {quiz?.passingScore}% · Max attempts: {quiz?.maxAttempts}
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <p className="text-xs text-gray-500">Total Attempts</p>
          <p className="text-lg font-semibold text-gray-800">{stats.total}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <p className="text-xs text-gray-500">Evaluated</p>
          <p className="text-lg font-semibold text-gray-800">{stats.evaluated}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <p className="text-xs text-gray-500">Passed</p>
          <p className="text-lg font-semibold text-green-600">{stats.passed}</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
          <p className="text-xs text-gray-500">In Progress</p>
          <p className="text-lg font-semibold text-yellow-600">{stats.inProgress}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <label className="text-sm text-gray-600">Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All</option>
          <option value="in_progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="evaluated">Evaluated</option>
        </select>
      </div>

      {filteredAttempts.length === 0 ? (
        <div className="text-sm text-gray-500 py-8 text-center border border-dashed border-gray-300 rounded-lg">
          No attempts found.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Enrollment ID</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Attempt #</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Score</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Result</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Started</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttempts.map((a) => (
                <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-700">#{a.enrollmentId}</td>
                  <td className="px-4 py-2 text-gray-700">{a.attemptNumber}</td>
                  <td className="px-4 py-2">{statusBadge(a.status)}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {a.status === "evaluated" ? `${a.scoredMarks}/${a.totalMarks} (${a.percentage}%)` : "—"}
                  </td>
                  <td className="px-4 py-2">
                    {a.status === "evaluated" ? (
                      <span
                        className={`text-xs font-medium ${a.passed ? "text-green-600" : "text-red-600"}`}
                      >
                        {a.passed ? "Passed" : "Failed"}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{formatDate(a.startedAt)}</td>
                  <td className="px-4 py-2 text-gray-600 whitespace-nowrap">{formatDate(a.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuizAttempts;