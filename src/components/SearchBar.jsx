import { HiSearch } from "react-icons/hi";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative">
    <HiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800"
    />
  </div>
);

export default SearchBar;
