const CourseFilters = ({ filters, activeFilters, onChange }) => (
  <aside className="card space-y-6 p-5">
    {filters.map((group) => (
      <div key={group.title}>
        <h4 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">{group.title}</h4>
        <div className="space-y-2">
          {group.options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                checked={activeFilters[group.title]?.includes(option) || false}
                onChange={() => onChange(group.title, option)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              {option}
            </label>
          ))}
        </div>
      </div>
    ))}
  </aside>
);

export default CourseFilters;
