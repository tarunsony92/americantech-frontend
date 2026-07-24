import { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../api/axiosInstance";
import Pagination from "../../components/Pagination";

const AuditLogs = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 20;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get("/audit-logs", { params: { page, limit: pageSize } });
      setRows(data.data?.items || []);
      setTotal(data.data?.total ?? 0);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load audit logs.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div>
      <Helmet><title>Audit Logs | Admin</title></Helmet>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Audit Logs</h1>
      <p className="mt-1 text-sm text-slate-500">Read-only. Login, account, and admin-action history.</p>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-950">
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-500">No activity recorded yet.</td></tr>
            ) : (
              rows.map((log) => (
                <tr key={log.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="px-4 py-3 whitespace-nowrap">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-3">{log.user?.email || "—"}</td>
                  <td className="px-4 py-3">{log.actor?.email || "—"}</td>
                  <td className="px-4 py-3">{log.ipAddress || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={page}
          totalPages={Math.max(1, Math.ceil(total / pageSize))}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};

export default AuditLogs;
