// pages/dashboard/MyQuizzes.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import quizApi from "../../api/quizApi";

const MyQuizzes = () => {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [quizzesByBatch, setQuizzesByBatch] = useState({}); // { batchId: [quiz, ...] }
  const [attemptInfo, setAttemptInfo] = useState({}); // { quizId: { count, lastEvaluatedAttempt } }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const enrollRes = await axiosInstance.get("/enrollments/mine");
        const myEnrollments =
          enrollRes?.data?.data?.items ||
          enrollRes?.data?.data ||
          enrollRes?.data?.items ||
          [];

        setEnrollments(myEnrollments);

        // Sirf un batches ke quizzes lao jinme student enrolled hai
        const uniqueBatchIds = [
          ...new Set(myEnrollments.map((e) => e.batchId).filter(Boolean)),
        ];

        if (uniqueBatchIds.length === 0) {
          setQuizzesByBatch({});
          return;
        }

        const results = await Promise.all(
          uniqueBatchIds.map((batchId) =>
            quizApi
              .listQuizzesByBatch(batchId)
              .then((res) => ({
                batchId,
                quizzes: (res?.data?.data || []).filter(
                  (q) => q.status === "published"
                ),
                failed: false,
              }))
              .catch(() => ({ batchId, quizzes: [], failed: true }))
          )
        );

        const map = {};
        let anyFailed = false;
        results.forEach(({ batchId, quizzes, failed }) => {
          map[batchId] = quizzes;
          if (failed) anyFailed = true;
        });

        setQuizzesByBatch(map);
        if (anyFailed) {
          setError("Kuch batches ke quizzes load nahi ho paye. Baaki neeche dikh rahe hain.");
        }

        // Ab har quiz ke liye attempts fetch karo (uske enrollment ke against)
        const attemptFetches = [];
        Object.entries(map).forEach(([batchId, quizzes]) => {
          const enrollment = myEnrollments.find(
            (e) => String(e.batchId) === String(batchId)
          );
          if (!enrollment) return;

          quizzes.forEach((quiz) => {
            attemptFetches.push(
              quizApi
                .listMyAttempts(quiz.id, enrollment.id)
                .then((res) => {
                  const attempts = res?.data?.data || [];
                  const evaluatedAttempts = attempts.filter(
                    (a) => a.status === "evaluated"
                  );
                  // latest evaluated attempt (highest attemptNumber)
                  const lastEvaluatedAttempt =
                    evaluatedAttempts.length > 0
                      ? evaluatedAttempts.reduce((latest, curr) =>
                          curr.attemptNumber > latest.attemptNumber ? curr : latest
                        )
                      : null;

                  return {
                    quizId: quiz.id,
                    count: attempts.length,
                    lastEvaluatedAttempt,
                  };
                })
                .catch(() => ({
                  quizId: quiz.id,
                  count: null,
                  lastEvaluatedAttempt: null,
                }))
            );
          });
        });

        const attemptResults = await Promise.all(attemptFetches);
        const infoMap = {};
        attemptResults.forEach(({ quizId, count, lastEvaluatedAttempt }) => {
          infoMap[quizId] = { count, lastEvaluatedAttempt };
        });
        setAttemptInfo(infoMap);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load your quizzes.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="text-sm text-gray-500 py-10 text-center">
        Loading your quizzes...
      </div>
    );
  }

  if (enrollments.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-10 text-center border border-dashed border-gray-300 rounded-lg">
        You are not enrolled in any course yet.
      </div>
    );
  }

  const totalQuizzes = Object.values(quizzesByBatch).flat().length;

  return (
    <div className="space-y-8">
      {error && (
        <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {totalQuizzes === 0 ? (
        <div className="text-sm text-gray-500 py-10 text-center border border-dashed border-gray-300 rounded-lg">
          No quizzes available yet for your enrolled batches.
        </div>
      ) : (
        enrollments.map((enrollment) => {
          const quizzes = quizzesByBatch[enrollment.batchId] || [];
          if (quizzes.length === 0) return null;

          return (
            <div key={enrollment.id}>
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-gray-700">
                  {enrollment.course?.title || `Course #${enrollment.courseId}`}
                </h2>
                {enrollment.batch?.name && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Batch: {enrollment.batch.name}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                {quizzes.map((quiz) => {
                  const info = attemptInfo[quiz.id] || {};
                  const usedAttempts = info.count;
                  const maxAttempts = quiz.maxAttempts || 1;
                  const limitReached =
                    usedAttempts !== null &&
                    usedAttempts !== undefined &&
                    usedAttempts >= maxAttempts;
                  const lastResult = info.lastEvaluatedAttempt;

                  return (
                    <div
                      key={quiz.id}
                      className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div>
                        <h3 className="font-medium text-gray-800">{quiz.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {quiz.durationMinutes ? `${quiz.durationMinutes} min` : "Untimed"} ·{" "}
                          Passing: {quiz.passingScore}% ·{" "}
                          Attempts: {usedAttempts ?? "-"}/{maxAttempts}
                        </p>

                        {lastResult && (
                          <p
                            className={`text-xs mt-1 font-medium ${
                              lastResult.passed ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            Last score: {lastResult.scoredMarks}/{lastResult.totalMarks} (
                            {lastResult.percentage}%) ·{" "}
                            {lastResult.passed ? "Passed" : "Not passed"}
                          </p>
                        )}

                        {limitReached && !lastResult && (
                          <p className="text-xs text-red-600 mt-1 font-medium">
                            Attempt limit reached
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-4">
                        {lastResult && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/dashboard/quizzes/${quiz.id}/result/${lastResult.id}`
                              )
                            }
                            className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition"
                          >
                            View Result
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={limitReached}
                          onClick={() =>
                            navigate(`/dashboard/quizzes/${quiz.id}/attempt`, {
                              state: {
                                enrollmentId: enrollment.id,
                                batchId: enrollment.batchId,
                              },
                            })
                          }
                          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                            limitReached
                              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          {limitReached ? "Limit Reached" : "Start Quiz"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyQuizzes;