import { useEffect, useState, useRef } from "react";
import { HiX } from "react-icons/hi";

/**
 * fields: [{ key, label, type?: "text"|"number"|"textarea"|"checkbox"|"select", options?: string[], onChange?: (value, allValues) => void }]
 * initialValues: existing row when editing, or null when creating.
 *
 * If a field defines onChange, it fires both when the user changes that field AND once on
 * mount using the initial value — so dependent fields (e.g. a Batch dropdown that depends on
 * the selected Course) populate correctly in edit mode too, not just on fresh selection.
 */
const ResourceFormModal = ({ title, fields, initialValues, onClose, onSubmit }) => {
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const didInitRef = useRef(false);

  useEffect(() => {
    const defaults = {};
    fields.forEach((f) => {
      defaults[f.key] = initialValues ? initialValues[f.key] ?? "" : f.type === "checkbox" ? false : "";
    });
    setValues(defaults);
    didInitRef.current = false;
  }, [fields, initialValues]);

  // Fire each field's onChange once with its starting value, so dependent dropdowns
  // (e.g. Batch depending on Course) load correctly when editing an existing row.
  useEffect(() => {
    if (didInitRef.current) return;
    if (Object.keys(values).length === 0) return;
    fields.forEach((f) => {
      if (f.onChange && values[f.key] !== "" && values[f.key] != null) {
        f.onChange(values[f.key], values);
      }
    });
    didInitRef.current = true;
  }, [values, fields]);

  const handleChange = (key, value) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      const field = fields.find((f) => f.key === key);
      if (field?.onChange) field.onChange(value, next);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save. Please check the fields and try again.");
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            {initialValues ? `Edit ${title}` : `Add ${title}`}
          </h2>
          <button onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <HiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              {f.type !== "checkbox" && (
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200">{f.label}</label>
              )}

              {f.type === "textarea" ? (
                <textarea
                  rows={4}
                  value={values[f.key] ?? ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  required={f.required}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              ) : f.type === "select" ? (
                <select
                  value={values[f.key] ?? ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  required={f.required}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <option value="">Select...</option>
                  {(f.options || []).map((opt) => {
                    const value = typeof opt === "object" ? opt.value : opt;
                    const label = typeof opt === "object" ? opt.label : opt;
                    return <option key={value} value={value}>{label}</option>;
                  })}
                </select>
              ) : f.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={!!values[f.key]}
                    onChange={(e) => handleChange(f.key, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600"
                  />
                  {f.label}
                </label>
              ) : (
                <input
                  type={f.type || "text"}
                  value={values[f.key] ?? ""}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  required={f.required}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              )}
            </div>
          ))}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceFormModal;