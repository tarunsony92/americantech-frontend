import { useEffect, useState, useCallback } from "react";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus } from "react-icons/hi";
import SearchBar from "../SearchBar";
import Pagination from "../Pagination";
import ResourceFormModal from "./ResourceFormModal";

/**
 * Reusable admin list view for any resource exposed via createResourceService.
 * columns: [{ key, label }] — rendered straight from each row.
 * fields: [{ key, label, type?, options?, required? }] — drives the Add/Edit modal.
 *   Pass `fields` to get working Add New / Edit buttons out of the box; omit it and the
 *   page is read-only (list + delete only).
 */
const ResourceManager = ({ title, service, columns, fields, hideAddButton }) => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState(null); // null | { mode: "create" } | { mode: "edit", row }
  const pageSize = 10;

  const fetchRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await service.list({ page, limit: pageSize, search });
      setRows(data.data?.items || data.items || data.data || []);
      setTotal(data.data?.total ?? data.total ?? 0);
    } catch (err) {
      setError(err.response?.data?.message || `Couldn't load ${title.toLowerCase()}. Is the API running?`);
    } finally {
      setLoading(false);
    }
  }, [page, search, service, title]);

  useEffect(() => { fetchRows(); }, [fetchRows]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await service.remove(id);
      fetchRows();
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed.");
    }
  };

  const handleModalSubmit = async (values) => {
    if (modalState.mode === "edit") {
      await service.update(modalState.row.id, values);
    } else {
      await service.create(values);
    }
    setModalState(null);
    fetchRows();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {fields && !hideAddButton && (
          <button onClick={() => setModalState({ mode: "create" })} className="btn-primary">
            <HiOutlinePlus className="h-4 w-4" /> Add New
          </button>
        )}
      </div>

      <div className="mt-4 max-w-sm">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder={`Search ${title.toLowerCase()}...`} />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>
      )}

      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900">
            <tr>
              {columns.map((c) => <th key={c.key} className="px-4 py-3">{c.label}</th>)}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-950">
            {loading ? (
              <tr><td colSpan={columns.length + 1} className="px-4 py-6 text-center text-slate-500">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="px-4 py-6 text-center text-slate-500">No records found.</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-200 dark:border-slate-800">
                  {columns.map((c) => <td key={c.key} className="px-4 py-3">{typeof row[c.key] === "object" && row[c.key] ? row[c.key].name : String(row[c.key] ?? "")}</td>)}
                  <td className="px-4 py-3 text-right">
                    {fields && (
                      <button onClick={() => setModalState({ mode: "edit", row })} className="mr-2 rounded p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <HiOutlinePencil className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(row.id)} className="rounded p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950">
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(total / pageSize))} onPageChange={setPage} />

      {modalState && fields && !(hideAddButton && modalState.mode === "create") && (
        <ResourceFormModal
          title={title}
          fields={fields}
          initialValues={modalState.mode === "edit" ? modalState.row : null}
          onClose={() => setModalState(null)}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
};

export default ResourceManager;
