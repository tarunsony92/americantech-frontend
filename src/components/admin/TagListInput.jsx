// components/admin/TagListInput.jsx
import { useState } from "react";
import { HiX, HiPlus } from "react-icons/hi";

// Lets the admin add/remove free-text items for array columns like skills, requirements, etc.
const TagListInput = ({ label, values, onChange, placeholder }) => {
  const [draft, setDraft] = useState("");

  const addItem = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...values, trimmed]);
    setDraft("");
  };

  const removeItem = (idx) => onChange(values.filter((_, i) => i !== idx));

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none dark:border-slate-600 dark:bg-slate-800"
        />
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <HiPlus className="h-4 w-4" /> Add
        </button>
      </div>

      {values.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {values.map((v, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-200"
            >
              <span>{v}</span>
              <button type="button" onClick={() => removeItem(idx)} className="text-slate-400 hover:text-red-500">
                <HiX className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagListInput;