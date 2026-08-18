// pages/admin/AdminCourseJobForm.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import courseJobService from "../../services/courseJobService";
import TagListInput from "../../components/admin/TagListInput";

const EMPTY_FORM = {
  title: "",
  company: "",
  course: "",
  location: "",
  type: "Full-time",
  experienceLevel: "Entry",
  salaryMin: "",
  salaryMax: "",
  currency: "$",
  description: "",
  responsibilities: [],
  requirements: [],
  skills: [],
  applyLink: "",
  isActive: true,
};

const TYPE_OPTIONS = ["Full-time", "Part-time", "Contract", "Internship", "Remote", "Hybrid" , "On-site"];
const LEVEL_OPTIONS = ["Entry", "Mid", "Senior", "Lead"];

const AdminCourseJobForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    courseJobService
      .getById(id)
      .then((job) => {
        if (!active) return;
        setForm({
          ...EMPTY_FORM,
          ...job,
          salaryMin: job.salaryMin != null ? String(job.salaryMin) : "",
          salaryMax: job.salaryMax != null ? String(job.salaryMax) : "",
          responsibilities: job.responsibilities || [],
          requirements: job.requirements || [],
          skills: job.skills || [],
        });
      })
      .catch(() => active && setError("Failed to load job."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, isEdit]);

  const updateField = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

   const payload = {
  ...form,
  salaryMin: form.salaryMin,
  salaryMax: form.salaryMax,
};

    try {
      if (isEdit) {
        await courseJobService.update(id, payload);
      } else {
        await courseJobService.create(payload);
      }
      navigate("/admin/coursejobs");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save job.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-slate-500">Loading job...</div>;
  }

  return (
    <>
      <Helmet><title>{isEdit ? "Edit" : "New"} Course Job | Admin</title></Helmet>

      <h1 className="mb-6 text-2xl font-extrabold text-slate-900 dark:text-white">
        {isEdit ? "Edit Job Posting" : "Create New Job Posting"}
      </h1>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 dark:bg-slate-800">
        {/* Basic info */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
           
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Job Title *</label>
            <input
              required
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>
<div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
    Company Logo URL
  </label>
  <input
    type="url"
    value={form.imageUrl}
    onChange={(e) => updateField("imageUrl", e.target.value)}
    placeholder="https://example.com/logoamerican.jpeg"
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
  />
</div>
          

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Company *</label>
            <input
              required
              type="text"
              value={form.company}
              onChange={(e) => updateField("company", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
    Course
  </label>
  <input
    type="text"
    placeholder="e.g. B.Tech CSE"
    value={form.course}
    onChange={(e) => updateField("course", e.target.value)}
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
  />
</div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => updateField("location", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Apply Link</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.applyLink}
              onChange={(e) => updateField("applyLink", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Job Type</label>
            <select
              value={form.type}
              onChange={(e) => updateField("type", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            >
              {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Experience Level</label>
            <select
              value={form.experienceLevel}
              onChange={(e) => updateField("experienceLevel", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            >
              {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
    Salary Min
  </label>
  <input
    type="text"
    placeholder="e.g. 25K"
    value={form.salaryMin}
    onChange={(e) => updateField("salaryMin", e.target.value)}
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
  />
</div>

          <div>
  <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
    Salary Max
  </label>
  <input
    type="text"
    placeholder="e.g. 50K"
    value={form.salaryMax}
    onChange={(e) => updateField("salaryMax", e.target.value)}
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
  />
</div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Currency</label>
            <input
              type="text"
              value={form.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => updateField("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Active (visible to applicants)
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Description *</label>
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
          />
        </div>

        {/* Array fields */}
        <TagListInput
          label="Responsibilities"
          values={form.responsibilities}
          onChange={(v) => updateField("responsibilities", v)}
          placeholder="Type a responsibility and press Enter"
        />
        <TagListInput
          label="Requirements"
          values={form.requirements}
          onChange={(v) => updateField("requirements", v)}
          placeholder="Type a requirement and press Enter"
        />
        <TagListInput
          label="Skills"
          values={form.skills}
          onChange={(v) => updateField("skills", v)}
          placeholder="Type a skill and press Enter"
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700">
          <button
            type="button"
            onClick={() => navigate("/admin/coursejobs")}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Update Job" : "Create Job"}
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminCourseJobForm;