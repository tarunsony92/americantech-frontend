// pages/admin/AdminCourseJobs.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiPlus, HiPencil, HiTrash, HiOutlineBriefcase } from "react-icons/hi";
import courseJobService from "../../services/courseJobService";
import useResourceList from "../../hooks/useResourceList";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import ConfirmDialog from "../../components/admin/ConfirmDialog";

const AdminCourseJobs = () => {
  const { items, meta, params, setParams, loading, error, refetch } = useResourceList(courseJobService, { limit: 10 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  const handleSearch = (value) => setParams((p) => ({ ...p, search: value, page: 1 }));
  const handlePageChange = (page) => setParams((p) => ({ ...p, page }));

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setActionError(null);
    try {
      await courseJobService.remove(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setActionError(err?.response?.data?.message || "Failed to delete job.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Helmet><title>Manage Course Jobs | Admin</title></Helmet>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Course Jobs</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create, edit and manage job postings.</p>
        </div>
        <Link
          to="/admin/coursejobs/new"
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700"
        >
          <HiPlus className="h-4 w-4" /> New Job
        </Link>
      </div>

      <div className="mb-4 max-w-md">
        <SearchBar value={params.search} onChange={handleSearch} placeholder="Search by title, company..." />
      </div>

      {(error || actionError) && (
        <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
          {error || actionError}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl bg-white shadow-md ring-1 ring-black/5 dark:bg-slate-800">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/40">
            <tr>
              {["Title", "Company", "Type", "Level", "Status", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">Loading...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  <HiOutlineBriefcase className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                  No jobs found.
                </td>
              </tr>
            ) : (
              items.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">{job.title}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{job.company}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{job.type}</td>
                  <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{job.experienceLevel}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        job.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {job.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/coursejobs/${job.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800"
                        title="Edit"
                      >
                        <HiPencil className="h-4.5 w-4.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(job)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <HiTrash className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete job posting?"
        message={`This will permanently remove "${deleteTarget?.title}". This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
};

export default AdminCourseJobs;