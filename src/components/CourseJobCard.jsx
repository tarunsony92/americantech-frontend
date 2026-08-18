// components/CourseJobCard.jsx

import { Link } from "react-router-dom";
import {
  HiOutlineLocationMarker,
  HiOutlineBriefcase,
  HiOutlineClock,
} from "react-icons/hi";

const CourseJobCard = ({ job }) => {
  const {
    id,
    title,
    company,
    location,
    type,
    experienceLevel,
    salaryMin,
    salaryMax,
    currency,
    createdAt,
  } = job;

  const hasSalary = salaryMin != null || salaryMax != null;

  const salary = hasSalary
    ? `${currency || "USD"} ${
        salaryMin != null ? salaryMin.toLocaleString() : ""
      }${
        salaryMin != null && salaryMax != null ? " - " : ""
      }${
        salaryMax != null ? salaryMax.toLocaleString() : ""
      }`
    : "Not disclosed";

  return (
    <div className="card group overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="line-clamp-2 text-base font-semibold text-slate-900 dark:text-white">
              {title}
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {company}
            </p>
          </div>

          {type && (
            <span className="flex-shrink-0 rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
              {type}
            </span>
          )}
        </div>

        {/* Job Info */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          {location && (
            <span className="flex items-center gap-1">
              <HiOutlineLocationMarker className="h-4 w-4" />
              {location}
            </span>
          )}

          {experienceLevel && (
            <span className="flex items-center gap-1">
              <HiOutlineBriefcase className="h-4 w-4" />
              {experienceLevel}
            </span>
          )}

          {createdAt && (
            <span className="flex items-center gap-1">
              <HiOutlineClock className="h-4 w-4" />
              {new Date(createdAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Salary + View Job */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-lg font-bold text-primary-700 dark:text-primary-400">
            {salary}
          </span>

          {/* IMPORTANT:
              CourseJob details route
              /jobscourse/:id
          */}
          <Link to={`/jobscourse/${id}`} className="btn-outline px-4 py-1.5 text-xs">
  View Job
</Link>
        </div>
      </div>
    </div>
  );
};

export default CourseJobCard;