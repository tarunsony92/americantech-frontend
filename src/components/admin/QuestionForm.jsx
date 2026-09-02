import React, { useState } from "react";

const QuestionForm = ({ initialData, isEditing, onSubmit, onCancel }) => {
  const [questionText, setQuestionText] = useState(initialData.questionText || "");
  const [questionType, setQuestionType] = useState(initialData.questionType || "single");
  const [marks, setMarks] = useState(initialData.marks ?? 1);
  const [options, setOptions] = useState(
    initialData.options && initialData.options.length > 0
      ? initialData.options.map((o) => ({ id: o.id, optionText: o.optionText, isCorrect: !!o.isCorrect }))
      : [
          { optionText: "", isCorrect: true },
          { optionText: "", isCorrect: false },
        ]
  );
  const [formError, setFormError] = useState("");

  const handleOptionTextChange = (index, value) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? { ...opt, optionText: value } : opt)));
  };

  const handleToggleCorrect = (index) => {
    setOptions((prev) =>
      prev.map((opt, i) => {
        if (questionType === "single") {
          return { ...opt, isCorrect: i === index };
        }
        return i === index ? { ...opt, isCorrect: !opt.isCorrect } : opt;
      })
    );
  };

  const handleAddOption = () => {
    setOptions((prev) => [...prev, { optionText: "", isCorrect: false }]);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) return; // enforce minimum 2 options
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTypeChange = (type) => {
    setQuestionType(type);
    if (type === "single") {
      // keep only the first correct option marked
      let foundFirst = false;
      setOptions((prev) =>
        prev.map((opt) => {
          if (opt.isCorrect && !foundFirst) {
            foundFirst = true;
            return opt;
          }
          return { ...opt, isCorrect: false };
        })
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    if (!questionText.trim()) {
      setFormError("Question text is required");
      return;
    }
    if (options.some((opt) => !opt.optionText.trim())) {
      setFormError("All options must have text");
      return;
    }
    if (options.length < 2) {
      setFormError("At least 2 options are required");
      return;
    }
    if (!options.some((opt) => opt.isCorrect)) {
  setFormError("Mark at least one option as correct");
  return;
}

if (
  questionType === "single" &&
  options.filter((opt) => opt.isCorrect).length !== 1
) {
  setFormError(
    "Single correct question must have exactly one correct option"
  );
  return;
}

    onSubmit({
      questionText: questionText.trim(),
      questionType,
      marks: Number(marks) || 1,
      options,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm mb-4 space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={2}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter the question"
        />
      </div>

      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={questionType}
            onChange={(e) => handleTypeChange(e.target.value)}
            disabled={isEditing}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="single">Single correct</option>
            <option value="multiple">Multiple correct</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marks</label>
          <input
            type="number"
            min="1"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            className="w-24 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
        <div className="space-y-2">
          {options.map((opt, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input
                type={questionType === "single" ? "radio" : "checkbox"}
                name="correct-option"
                checked={opt.isCorrect}
                onChange={() => handleToggleCorrect(idx)}
                className="shrink-0"
              />
              <input
                value={opt.optionText}
                onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {options.length > 2 && !opt.id && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="text-gray-400 hover:text-red-600 text-sm"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleAddOption}
            className="mt-2 text-xs text-blue-600 hover:underline font-medium"
          >
            + Add option
          </button>
        )}
      </div>

      {formError && <p className="text-xs text-red-600">{formError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
        >
          {isEditing ? "Update Question" : "Add Question"}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;