// components/admin/TagListInput.jsx
import { useState } from "react";

const parseBulkText = (text) => {
  if (!text) return [];

  // Agar text me newlines hain, un per split karo
  let lines = text.includes("\n") ? text.split("\n") : [text];

  // Agar sirf ek hi line hai aur usme commas hain, comma se split
  if (lines.length === 1 && lines[0].includes(",")) {
    lines = lines[0].split(",");
  }

  return lines
    .map((line) =>
      line
        .trim()
        // bullet markers hatao: -, *, •, 1., 1), etc.
        .replace(/^[-*•]\s*/, "")
        .replace(/^\d+[\.\)]\s*/, "")
        .trim()
    )
    .filter(Boolean);
};

const TagListInput = ({ label, values, onChange, placeholder }) => {
  const [input, setInput] = useState("");

  const addValue = (val) => {
    const trimmed = val.trim();
    if (trimmed && !values.includes(trimmed)) {
      onChange([...values, trimmed]);
    }
  };

  const addMultiple = (arr) => {
    const merged = [...values];
    arr.forEach((v) => {
      if (v && !merged.includes(v)) merged.push(v);
    });
    onChange(merged);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        addValue(input);
        setInput("");
      }
    } else if (e.key === "Backspace" && !input && values.length) {
      onChange(values.slice(0, -1));
    }
  };

  // Yahi hai asli magic: jab bhi user kuch paste kare
  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text");
    if (!pasted) return;

    const parsed = parseBulkText(pasted);

    // Agar paste me ek se zyada item bane, to auto-split kar do
    if (parsed.length > 1) {
      e.preventDefault();
      addMultiple(parsed);
      setInput("");
    }
    // Agar sirf 1 item bana, to normal paste hone do (input me type ho jayega)
  };

  const removeValue = (idx) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <div className="flex flex-wrap gap-2 rounded-lg border border-slate-300 p-2 dark:border-slate-600 dark:bg-slate-900">
        {values.map((val, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
          >
            {val}
            <button
              type="button"
              onClick={() => removeValue(idx)}
              className="text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-200"
            >
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder || "Type and press Enter, or paste a list"}
          className="min-w-[160px] flex-1 border-none bg-transparent text-sm focus:outline-none dark:text-white"
        />
      </div>

      <p className="mt-1 text-xs text-slate-400">
        Tip: आप पूरा paragraph/list paste कर सकते हैं (bullets, नई lines, या commas से अलग) — यह automatically अलग-अलग tags में बंट जाएगा।
      </p>
    </div>
  );
};

export default TagListInput;