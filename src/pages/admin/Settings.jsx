import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import axiosInstance from "../../api/axiosInstance";

// Site settings are stored as generic { key, value } rows (see SiteSetting model), not a single
// fixed object — so saving means upserting one row per known key: update it if it already
// exists, create it if this is the first time it's being set.
const KEYS = ["siteName", "contactEmail", "contactPhone"];

const Settings = () => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [existingByKey, setExistingByKey] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/site-settings", { params: { limit: 100 } })
      .then(({ data }) => {
        const rows = data.data?.items || [];
        const byKey = {};
        const values = {};
        rows.forEach((row) => {
          if (KEYS.includes(row.key)) {
            byKey[row.key] = row;
            values[row.key] = row.value;
          }
        });
        setExistingByKey(byKey);
        reset(values);
      })
      .catch((err) => setLoadError(err.response?.data?.message || "Couldn't load site settings."))
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (data) => {
    setStatus("idle");
    setSaveError(null);
    try {
      await Promise.all(
        KEYS.map((key) => {
          const value = data[key] ?? "";
          const existing = existingByKey[key];
          return existing
            ? axiosInstance.put(`/site-settings/${existing.id}`, { key, value })
            : axiosInstance.post("/site-settings", { key, value });
        })
      );
      setStatus("success");
    } catch (err) {
      setSaveError(err.response?.data?.message || "Couldn't save settings. Please try again.");
      setStatus("error");
    }
  };

  return (
    <>
      <Helmet><title>Site Settings | Admin</title></Helmet>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Site Settings</h1>

      {loading ? (
        <p className="mt-6 text-sm text-slate-500">Loading...</p>
      ) : loadError ? (
        <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{loadError}</p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 max-w-xl space-y-5 p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Site Name</label>
            <input {...register("siteName")} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Contact Email</label>
            <input type="email" {...register("contactEmail")} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Contact Phone</label>
            <input {...register("contactPhone")} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
          </div>
          {status === "success" && <p className="text-sm text-green-600">Settings saved successfully.</p>}
          {status === "error" && <p className="text-sm text-red-500">{saveError}</p>}
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Saving..." : "Save Settings"}
          </button>
        </form>
      )}
    </>
  );
};

export default Settings;
