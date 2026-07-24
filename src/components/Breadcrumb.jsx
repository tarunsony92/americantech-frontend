import { Link } from "react-router-dom";
import { HiChevronRight, HiHome } from "react-icons/hi";

const Breadcrumb = ({ items = [] }) => (
  <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
    <Link to="/" className="flex items-center hover:text-primary-600"><HiHome className="h-4 w-4" /></Link>
    {items.map((item, idx) => (
      <span key={item.label} className="flex items-center gap-1.5">
        <HiChevronRight className="h-3.5 w-3.5" />
        {item.to && idx !== items.length - 1 ? (
          <Link to={item.to} className="hover:text-primary-600">{item.label}</Link>
        ) : (
          <span className="text-slate-800 dark:text-slate-200">{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumb;
