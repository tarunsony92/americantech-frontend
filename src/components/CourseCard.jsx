import { Link } from "react-router-dom";
import { HiOutlineClock, HiOutlineAcademicCap, HiStar } from "react-icons/hi";

const CourseCard = ({ course }) => {
  const { id, title, category, duration, level, rating, price, image } = course;

  return (
    <div className="card group overflow-hidden">
      <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
          {category}
        </span>
      </div>
      <div className="p-5">
        <h3 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><HiOutlineClock className="h-4 w-4" /> {duration}</span>
          <span className="flex items-center gap-1"><HiOutlineAcademicCap className="h-4 w-4" /> {level}</span>
          <span className="flex items-center gap-1"><HiStar className="h-4 w-4 text-amber-400" /> {rating}</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-primary-700 dark:text-primary-400">{price}</span>
          <Link to={`/courses/${id}`} className="btn-outline px-4 py-1.5 text-xs">View Course</Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
