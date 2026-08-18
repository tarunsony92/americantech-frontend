import React from "react";
import {
  BriefcaseBusiness,
  MapPin,
  GraduationCap,
  DollarSign,
  Building2,
  Sparkles,
  Tag,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const typeConfig = {
  "Full-time": {
    emoji: "💼",
    className:
      "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  "Part-time": {
    emoji: "🕐",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  },
  Contract: {
    emoji: "📝",
    className:
      "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800",
  },
  Internship: {
    emoji: "🎓",
    className:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
  },
  Remote: {
    emoji: "🌎",
    className:
      "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800",
  },
};

const experienceConfig = {
  Entry: "🌱",
  Mid: "🚀",
  Senior: "🔥",
  Lead: "👑",
};

const formatSalary = (job) => {
  if (!job.salaryMin && !job.salaryMax) return null;

  const symbolMap = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  };

  const currency = job.currency || "USD";
  const symbol = symbolMap[currency] || `${currency} `;

  if (job.salaryMin && job.salaryMax) {
    return `${symbol}${job.salaryMin} - ${symbol}${job.salaryMax}`;
  }

  if (job.salaryMin) {
    return `From ${symbol}${job.salaryMin}`;
  }

  return `Up to ${symbol}${job.salaryMax}`;
};

const truncateText = (text, length = 85) => {
  if (!text) return "";
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

const CourseJobCard = ({ job }) => {
  const type = typeConfig[job.type] || typeConfig["Full-time"];

  const experienceEmoji =
    experienceConfig[job.experienceLevel] || "💼";

  const salary = formatSalary(job);

  const skills = Array.isArray(job.skills) ? job.skills : [];

  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : [];

  return (
    <div className="relative h-[480px] overflow-hidden bg-white dark:bg-slate-900 max-h-[220px] ">

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl" />

      <div className="relative flex h-full flex-col p-4">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">

          <div className="flex min-w-0 items-center gap-3">

            {/* Company Logo */}
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-md dark:border-slate-700 dark:bg-white">
  {job.imageUrl ? (
    <img
      src={job.imageUrl}
      alt={`${job.company || "Company"} logo`}
      className="h-full w-full object-contain"
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = "none";

        const fallback = e.currentTarget.parentElement?.querySelector(
          ".logo-fallback"
        );

        if (fallback) {
          fallback.classList.remove("hidden");
        }
      }}
    />
  ) : null}

  <span
    className={`logo-fallback text-base font-black text-indigo-600 ${
      job.imageUrl ? "hidden" : ""
    }`}
  >
    {job.company?.charAt(0)?.toUpperCase() || "C"}
  </span>
</div>

            <div className="min-w-0">
              <h3 className="line-clamp-2 text-[15px] font-extrabold leading-5 text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                {job.title}
              </h3>

              <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-indigo-500" />

                <span className="truncate">
                  {job.company}
                </span>
              </div>
            </div>

          </div>

          {/* Active */}
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {job.isActive ? "Active" : "Closed"}
          </span>

        </div>

        {/* Badges */}
        <div className="mt-3 flex flex-wrap gap-1.5">

          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-bold ${type.className}`}
          >
            {type.emoji}
            {job.type || "Full-time"}
          </span>

          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {experienceEmoji}
            {job.experienceLevel || "Entry"}
          </span>

          {job.category && (
            <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-1 text-[10px] font-bold text-violet-700 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300">
              <Tag className="h-2.5 w-2.5" />
              {job.category}
            </span>

            )}
        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <MapPin className="h-2.5 w-2.5" />
            {job.location || "Remote"}
          </span>




        </div>

        {/* Location + Salary */}
        <div className="mt-3 grid grid-cols-1 gap-2 w-full">

          

          <div className="rounded-lg border border-slate-100 bg-slate-50/70 px-2.5 w-full py-2 dark:border-slate-800 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">

              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-emerald-600 shadow-sm dark:bg-slate-700 dark:text-emerald-400">
                <DollarSign className="h-3.5 w-3.5" />
              </div>

              <div className="min-w-0">
                <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-400">
                  Salary
                </p>

                <p className="truncate text-[10px] font-bold text-slate-700 dark:text-slate-200">
                  {salary || "Competitive"}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Course */}
        {job.course && (
          <div className="mt-2.5 flex items-center gap-2.5 rounded-lg border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-2.5 py-2 dark:border-indigo-900/50 dark:from-indigo-950/30 dark:to-violet-950/30">

            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-600 text-white">
              <GraduationCap className="h-4 w-4" />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-wider text-indigo-500">
                Recommended Course
              </p>

             <p
  className="

    max-w-[180px]
    truncate
    text-[10px]
    font-bold
    bg-color-blue-500
    text-indigo-700
    dark:bg-color-blue-900
    dark:text-indigo-300
    
  "
  title={job.course}
>
  🎯 {job.course}
</p>
            </div>

          </div>
        )}



        

      </div>
    </div>
  );
};

export default CourseJobCard;