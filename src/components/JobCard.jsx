import { Link } from "react-router-dom";
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineClock } from "react-icons/hi";

const JobCard = ({ job }) => {
  const { id, title, company, location, type, postedAt } = job;

  return (
    <div className="card flex flex-col justify-between p-5">
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
        <p className="mt-1 text-sm text-primary-600 dark:text-primary-400">{company}</p>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1"><HiOutlineLocationMarker className="h-4 w-4" /> {location}</span>
          <span className="flex items-center gap-1"><HiOutlineBriefcase className="h-4 w-4" /> {type}</span>
          <span className="flex items-center gap-1"><HiOutlineClock className="h-4 w-4" /> {postedAt}</span>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Link to={`/careers/${id}`} className="btn-outline flex-1 text-xs">Details</Link>
        <Link to={`/careers/${id}/apply`} className="btn-primary flex-1 text-xs">Apply Now</Link>
      </div>
    </div>
  );
};

export default JobCard;
