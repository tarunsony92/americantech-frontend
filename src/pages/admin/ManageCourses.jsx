import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import courseService from "../../services/courseService";

const ManageCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadCourses = () => {
    setStatus("loading");
    courseService
      .list()
      .then(({ data }) => {
        setCourses(data?.data?.items || data?.data || []);
        setStatus("success");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Couldn't load courses.");
        setStatus("error");
      });
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await courseService.remove(id);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete course.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Helmet><title>Manage Courses | Admin</title></Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Courses</h1>

          <Link
            to="/admin/courses/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-indigo-700"
          >
            + Add Course
          </Link>
        </div>

        {status === "loading" && (
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading...</p>
        )}

        {status === "error" && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {status === "success" && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Level</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600 dark:text-slate-300">Price</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{course.title}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{course.category?.name || "-"}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{course.level}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{course.price}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/courses/${course.id}/edit`)}
                          className="rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          disabled={deletingId === course.id}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                        >
                          {deletingId === course.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">
                      No courses yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageCourses;