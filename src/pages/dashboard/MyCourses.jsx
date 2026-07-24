import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import enrollmentService from "../../services/enrollmentService";
import { formatCurrencyINR } from "../../utils/format";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    enrollmentService
      .listMine()
      .then(({ data }) => {
        setEnrollments(data.data?.items || []);
        setStatus("success");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Couldn't load your courses.");
        setStatus("error");
      });
  }, []);

  return (
    <>
      <Helmet><title>My Courses | American Tech Global</title></Helmet>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Courses</h1>

      {status === "loading" && <p className="mt-6 text-slate-500">Loading your courses...</p>}
      {error && <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}

      {status === "success" && enrollments.length === 0 && (
        <div className="mt-6 card p-8 text-center">
          <p className="text-slate-600 dark:text-slate-300">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="btn-primary mt-4 inline-flex">Browse Courses</Link>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {enrollments.map((enrollment) => (
          <div key={enrollment.id} className="card p-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{enrollment.course?.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{enrollment.course?.duration} · {enrollment.course?.level}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-slate-500">Progress: {enrollment.progress || 0}%</span>
              <span className="text-sm font-semibold text-primary-600">{formatCurrencyINR(enrollment.course?.price)}</span>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="h-full bg-primary-600" style={{ width: `${enrollment.progress || 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyCourses;
