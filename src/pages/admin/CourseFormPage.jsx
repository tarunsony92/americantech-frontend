import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import courseService from "../../services/courseService";
import TagListInput from "../../components/admin/TagListInput";

const EMPTY_FORM = {
  title: "",
  slug: "",
  categoryId: "",
  instructorId: "",
  description: "",
  duration: "",
  level: "Beginner",
  price: "",
  rating: "",
  image: "",
  isPublished: false,
  completionCertificateImage: "",
  microsoftCertificateImage: "",
  tools: [],
  eligibility: [],
  careerRoles: [],
  curriculum: [],
  capstoneProjects: [],
};

const LEVEL_OPTIONS = ["Beginner", "Intermediate", "Advanced"];

// ---- Small repeater for {title, desc} items (used for Curriculum) ----
const CurriculumRepeater = ({ values, onChange }) => {
  const addItem = () => onChange([...values, { title: "", desc: "" }]);
  const updateItem = (idx, field, val) => {
    const next = [...values];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };
  const removeItem = (idx) => onChange(values.filter((_, i) => i !== idx));

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Curriculum (Modules)
      </label>
      <div className="space-y-3">
        {values.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Module {idx + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-xs font-semibold text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              placeholder="Module title (e.g. Module 1: Foundations)"
              value={item.title}
              onChange={(e) => updateItem(idx, "title", e.target.value)}
              className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
            <textarea
              rows={2}
              placeholder="Module description"
              value={item.desc}
              onChange={(e) => updateItem(idx, "desc", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-3 rounded-lg border border-indigo-200 px-4 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950"
      >
        + Add Module
      </button>
    </div>
  );
};

// ---- Small repeater for {tag, title, desc} items (used for Capstone Projects) ----
const CapstoneRepeater = ({ values, onChange }) => {
  const addItem = () => onChange([...values, { tag: "", title: "", desc: "" }]);
  const updateItem = (idx, field, val) => {
    const next = [...values];
    next[idx] = { ...next[idx], [field]: val };
    onChange(next);
  };
  const removeItem = (idx) => onChange(values.filter((_, i) => i !== idx));

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        Capstone Projects
      </label>
      <div className="space-y-3">
        {values.map((item, idx) => (
          <div key={idx} className="rounded-lg border border-slate-200 p-3 dark:border-slate-700">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Project {idx + 1}</span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-xs font-semibold text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <input
              type="text"
              placeholder="Tag (e.g. Project 1)"
              value={item.tag}
              onChange={(e) => updateItem(idx, "tag", e.target.value)}
              className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
            <input
              type="text"
              placeholder="Project title"
              value={item.title}
              onChange={(e) => updateItem(idx, "title", e.target.value)}
              className="mb-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
            <textarea
              rows={2}
              placeholder="Project description"
              value={item.desc}
              onChange={(e) => updateItem(idx, "desc", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        className="mt-3 rounded-lg border border-indigo-200 px-4 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-300 dark:hover:bg-indigo-950"
      >
        + Add Project
      </button>
    </div>
  );
};

const CourseFormPage = () => {
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
    courseService
      .getById(id)
      .then((res) => {
        if (!active) return;
        const body = res?.data ?? res;
        const course = body?.data ?? body;

        setForm({
          ...EMPTY_FORM,
          ...course,
          categoryId: course.categoryId != null ? String(course.categoryId) : "",
          instructorId: course.instructorId != null ? String(course.instructorId) : "",
          price: course.price != null ? String(course.price) : "",
          rating: course.rating != null ? String(course.rating) : "",
          tools: course.tools || [],
          eligibility: course.eligibility || [],
          careerRoles: course.careerRoles || [],
          curriculum: course.curriculum || [],
          capstoneProjects: course.capstoneProjects || [],
        });
      })
      .catch(() => active && setError("Failed to load course."))
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
      categoryId: form.categoryId,
      instructorId: form.instructorId,
      price: form.price,
      rating: form.rating,
    };

    try {
      if (isEdit) {
        await courseService.update(id, payload);
      } else {
        await courseService.create(payload);
      }
      navigate("/admin/courses");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save course.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="py-24 text-center text-slate-500">Loading course...</div>;
  }

  return (
    <>
      <Helmet><title>{isEdit ? "Edit" : "New"} Course | Admin</title></Helmet>

      <h1 className="mb-6 text-2xl font-extrabold text-slate-900 dark:text-white">
        {isEdit ? "Edit Course" : "Create New Course"}
      </h1>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 dark:bg-slate-800">
        {/* Basic info */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Title *</label>
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
              Slug (url-friendly) *
            </label>
            <input
              required
              type="text"
              placeholder="e.g. full-stack-dev"
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Category ID *</label>
            <input
              required
              type="number"
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Registration Fee
            </label>
            <input
              type="number"
              value={form.instructorId}
              onChange={(e) => updateField("instructorId", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Duration (e.g. 16 Weeks)
            </label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => updateField("duration", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Level *</label>
            <select
              required
              value={form.level}
              onChange={(e) => updateField("level", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            >
              {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Price *</label>
            <input
              required
              type="number"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Rating</label>
            <input
              type="number"
              step="0.1"
              value={form.rating}
              onChange={(e) => updateField("rating", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/course.jpg"
              value={form.image}
              onChange={(e) => updateField("image", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Completion Certificate Image URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/certificate.jpg"
              value={form.completionCertificateImage}
              onChange={(e) => updateField("completionCertificateImage", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Microsoft Certificate Image URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/microsoft-cert.jpg"
              value={form.microsoftCertificateImage}
              onChange={(e) => updateField("microsoftCertificateImage", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              id="isPublished"
              type="checkbox"
              checked={form.isPublished}
              onChange={(e) => updateField("isPublished", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isPublished" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Published (visible to students)
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <textarea
            rows={5}
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900"
          />
        </div>

        {/* Simple string-array fields */}
        <TagListInput
          label="Tools Covered"
          values={form.tools}
          onChange={(v) => updateField("tools", v)}
          placeholder="Type a tool and press Enter"
        />
        <TagListInput
          label="Who Can Apply (Eligibility)"
          values={form.eligibility}
          onChange={(v) => updateField("eligibility", v)}
          placeholder="Type an eligibility point and press Enter"
        />
        <TagListInput
          label="Career Roles"
          values={form.careerRoles}
          onChange={(v) => updateField("careerRoles", v)}
          placeholder="Type a career role and press Enter"
        />

        {/* Object-array fields */}
        <CurriculumRepeater
          values={form.curriculum}
          onChange={(v) => updateField("curriculum", v)}
        />
        <CapstoneRepeater
          values={form.capstoneProjects}
          onChange={(v) => updateField("capstoneProjects", v)}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700">
          <button
            type="button"
            onClick={() => navigate("/admin/courses")}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving..." : isEdit ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>
    </>
  );
};

export default CourseFormPage;