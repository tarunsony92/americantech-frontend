import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { createResourceService } from "../../services/createResourceService";
import axiosInstance from "../../api/axiosInstance";

const userService = createResourceService("users");

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-slate-100 py-2 last:border-0 dark:border-slate-800">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{value ?? "-"}</span>
  </div>
);

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loginHistory, setLoginHistory] = useState([]);
  const [loginLoading, setLoginLoading] = useState(true);

  const [activityHistory, setActivityHistory] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    userService
      .getById(id)
      .then(({ data }) => setUser(data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    axiosInstance
      .get(`/users/${id}/login-history`, { params: { page: 1, limit: 10 } })
      .then(({ data }) => setLoginHistory(data.data?.items || []))
      .catch(() => setLoginHistory([]))
      .finally(() => setLoginLoading(false));
  }, [id]);

  useEffect(() => {
    axiosInstance
      .get(`/users/${id}/activity-history`, { params: { page: 1, limit: 10 } })
      .then(({ data }) => setActivityHistory(data.data?.items || []))
      .catch(() => setActivityHistory([]))
      .finally(() => setActivityLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading...</p>;
  }

  if (!user) {
    return <p className="text-sm text-slate-500">User not found.</p>;
  }

  return (
    <>
      <Helmet>
        <title>{user.fullName} | Admin</title>
      </Helmet>

      <button
        onClick={() => navigate("/admin/users")}
        className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to Users
      </button>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.fullName}</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            user.isActive
              ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
          }`}
        >
          {user.isActive ? "Active" : "Disabled"}
        </span>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ===== Profile info ===== */}
        <div className="card p-5 lg:col-span-1">
          <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">Profile</h2>
          <InfoRow label="Full Name" value={user.fullName} />
          <InfoRow label="Email" value={user.email} />
          <InfoRow label="Phone" value={user.phone} />
          <InfoRow label="Role" value={user.role?.name} />
          <InfoRow label="Email Verified" value={user.isEmailVerified ? "Yes" : "No"} />
          <InfoRow label="Last Login At" value={formatDate(user.lastLoginAt)} />
          <InfoRow label="Last Login IP" value={user.lastLoginIp} />
          <InfoRow label="Joined" value={formatDate(user.createdAt)} />
        </div>

        {/* ===== Course / Batch assignment ===== */}
        <div className="card p-5 lg:col-span-1">
          <h2 className="mb-3 font-semibold text-slate-900 dark:text-white">
            Course &amp; Batch
          </h2>
          <InfoRow label="Assigned Course" value={user.course?.title || (user.courseId ? `#${user.courseId}` : "-")} />
          <InfoRow label="Assigned Batch" value={user.batch?.name || (user.batchId ? `#${user.batchId}` : "-")} />
        </div>

        {/* ===== Login history ===== */}
        <div className="card overflow-hidden p-0 lg:col-span-1">
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="font-semibold text-slate-900 dark:text-white">Login History</h2>
          </div>
          {loginLoading ? (
            <p className="px-5 py-6 text-sm text-slate-500">Loading...</p>
          ) : loginHistory.length === 0 ? (
            <p className="px-5 py-6 text-sm text-slate-500">No login history found.</p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {loginHistory.map((session) => (
                <div
                  key={session.id}
                  className="border-b border-slate-100 px-5 py-3 text-sm last:border-0 dark:border-slate-800"
                >
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {formatDate(session.createdAt)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {session.ipAddress || "Unknown IP"} · {session.userAgent || "Unknown device"}
                  </p>
                  {session.revokedAt && (
                    <p className="text-xs text-red-500">Revoked {formatDate(session.revokedAt)}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== Activity history ===== */}
      <div className="card mt-6 overflow-hidden p-0">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h2 className="font-semibold text-slate-900 dark:text-white">Activity History</h2>
        </div>
        {activityLoading ? (
          <p className="px-5 py-6 text-sm text-slate-500">Loading...</p>
        ) : activityHistory.length === 0 ? (
          <p className="px-5 py-6 text-sm text-slate-500">No activity found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50">
                <tr>
                  <th className="px-5 py-3 font-medium">Action</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {activityHistory.map((log) => (
                  <tr key={log.id}>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{log.action}</td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{log.description || "-"}</td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDetail;