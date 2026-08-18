import React from "react";
import {
  BriefcaseBusiness,
  MapPin,
  GraduationCap,
  DollarSign,
  Building2,
  Tag,
  Clock3,
  Bookmark,
  Zap,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

/* =========================================================
   JOB TYPE CONFIG
========================================================= */

const typeConfig = {
  "Full-time": {
    emoji: "💼",
    className:
      "bg-violet-50 text-violet-700 border-violet-100",
  },

  "Part-time": {
    emoji: "🕐",
    className:
      "bg-blue-50 text-blue-700 border-blue-100",
  },

  Contract: {
    emoji: "📝",
    className:
      "bg-orange-50 text-orange-700 border-orange-100",
  },

  Internship: {
    emoji: "🎓",
    className:
      "bg-purple-50 text-purple-700 border-purple-100",
  },

  Remote: {
    emoji: "🌎",
    className:
      "bg-cyan-50 text-cyan-700 border-cyan-100",
  },
};

/* =========================================================
   EXPERIENCE CONFIG
========================================================= */

const experienceConfig = {
  Entry: "🌱",
  Mid: "🚀",
  Senior: "🔥",
  Lead: "👑",
};

/* =========================================================
   FORMAT SALARY
========================================================= */

const formatSalary = (job) => {
  if (!job.salaryMin && !job.salaryMax) {
    return null;
  }

  const symbolMap = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  };

  const currency = job.currency || "USD";

  const symbol =
    symbolMap[currency] || `${currency} `;

  if (job.salaryMin && job.salaryMax) {
    return `${symbol}${job.salaryMin}/yr - ${symbol}${job.salaryMax}/yr`;
  }

  if (job.salaryMin) {
    return `From ${symbol}${job.salaryMin}/yr`;
  }

  return `Up to ${symbol}${job.salaryMax}/yr`;
};

/* =========================================================
   FORMAT POSTED TIME
========================================================= */

const formatPostedTime = (createdAt) => {
  if (!createdAt) {
    return "Recently posted";
  }

  const createdDate = new Date(createdAt);

  // Invalid date protection
  if (Number.isNaN(createdDate.getTime())) {
    return "Recently posted";
  }

  const now = new Date();

  const differenceMs =
    now.getTime() - createdDate.getTime();

  // Future date protection
  if (differenceMs < 0) {
    return "Just now";
  }

  const differenceMinutes = Math.floor(
    differenceMs / (1000 * 60)
  );

  const differenceHours = Math.floor(
    differenceMinutes / 60
  );

  const differenceDays = Math.floor(
    differenceHours / 24
  );

  const differenceWeeks = Math.floor(
    differenceDays / 7
  );

  const differenceMonths = Math.floor(
    differenceDays / 30
  );

  const differenceYears = Math.floor(
    differenceDays / 365
  );

  /* Less than 1 minute */

  if (differenceMinutes < 1) {
    return "Just now";
  }

  /* Minutes */

  if (differenceMinutes < 60) {
    return `${differenceMinutes} ${
      differenceMinutes === 1 ? "min" : "mins"
    } ago`;
  }

  /* Hours */

  if (differenceHours < 24) {
    return `${differenceHours} ${
      differenceHours === 1 ? "hour" : "hours"
    } ago`;
  }

  /* Days */

  if (differenceDays < 7) {
    return `${differenceDays} ${
      differenceDays === 1 ? "day" : "days"
    } ago`;
  }

  /* Weeks */

  if (differenceDays < 30) {
    return `${differenceWeeks} ${
      differenceWeeks === 1 ? "week" : "weeks"
    } ago`;
  }

  /* Months */

  if (differenceDays < 365) {
    return `${differenceMonths} ${
      differenceMonths === 1 ? "month" : "months"
    } ago`;
  }

  /* Years */

  return `${differenceYears} ${
    differenceYears === 1 ? "year" : "years"
  } ago`;
};

/* =========================================================
   COURSE JOB CARD
========================================================= */

const CourseJobCard = ({ job }) => {
  const type =
    typeConfig[job.type] ||
    typeConfig["Full-time"];

  const experienceEmoji =
    experienceConfig[job.experienceLevel] ||
    "💼";

  const salary = formatSalary(job);

  const postedTime = formatPostedTime(
    job.createdAt
  );

  const initials =
    job.company?.charAt(0)?.toUpperCase() ||
    "C";

  return (
    <article
      className="
        group
        relative
        w-full
        overflow-hidden
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-indigo-200
        hover:shadow-lg
        hover:shadow-indigo-100/40

        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-indigo-800
      "
    >

      {/* =====================================================
          TOP ACCENT
      ===================================================== */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          h-0.5
          bg-gradient-to-r
          from-violet-500
          via-indigo-500
          to-blue-500
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      <div className="p-5">

        {/* ===================================================
            TOP ROW
        =================================================== */}

        <div className="flex items-start gap-5">

          {/* =================================================
              COMPANY LOGO
          ================================================= */}

          <div
            className="
              flex
              h-[70px]
              w-[70px]
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-xl
              border
              border-slate-200
              bg-white
              p-2
              shadow-sm
              dark:border-slate-700
              dark:bg-white
            "
          >
            {job.imageUrl ? (
              <img
                src={job.imageUrl}
                alt={`${job.company || "Company"} logo`}
                className="
                  h-full
                  w-full
                  object-contain
                "
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";

                  const fallback =
                    e.currentTarget.parentElement?.querySelector(
                      ".logo-fallback"
                    );

                  if (fallback) {
                    fallback.classList.remove(
                      "hidden"
                    );
                  }
                }}
              />
            ) : null}

            <span
              className={`
                logo-fallback
                text-xl
                font-black
                text-indigo-600
                ${job.imageUrl ? "hidden" : ""}
              `}
            >
              {initials}
            </span>
          </div>

          {/* =================================================
              JOB MAIN INFO
          ================================================= */}

          <div className="min-w-0 flex-1">

            {/* Job Title */}

            <h3
              className="
                text-lg
                font-extrabold
                leading-tight
                text-slate-900
                transition-colors
                group-hover:text-indigo-600

                dark:text-white
                dark:group-hover:text-indigo-400
              "
              title={job.title}
            >
              {job.title}
            </h3>

            {/* Company + Job Type */}

            <div
              className="
                mt-2
                flex
                flex-wrap
                items-center
                gap-2
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-sm
                  font-semibold
                  text-slate-600
                  dark:text-slate-300
                "
              >
                <Building2
                  className="
                    h-3.5
                    w-3.5
                    text-indigo-500
                  "
                />

                <span className="truncate">
                  {job.company}
                </span>
              </div>

              <span className="text-slate-300">
                •
              </span>

              <span
                className="
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {type.emoji}{" "}
                {job.type || "Full-time"}
              </span>

            </div>

            {/* =================================================
                TAGS
            ================================================= */}

            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-2
              "
            >

              {/* Category */}

              {job.category && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    border
                    border-violet-100
                    bg-violet-50
                    px-3
                    py-1.5
                    text-xs
                    font-semibold
                    text-violet-700

                    dark:border-violet-900
                    dark:bg-violet-950/40
                    dark:text-violet-300
                  "
                >
                  <Tag className="h-3 w-3" />

                  {job.category}
                </span>
              )}

              {/* Experience */}

              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  border
                  border-blue-100
                  bg-blue-50
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-blue-700

                  dark:border-blue-900
                  dark:bg-blue-950/40
                  dark:text-blue-300
                "
              >
                {experienceEmoji}

                {job.experienceLevel ||
                  "Entry"}
              </span>

              {/* Location */}

              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  border
                  border-indigo-100
                  bg-indigo-50
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-indigo-700

                  dark:border-indigo-900
                  dark:bg-indigo-950/40
                  dark:text-indigo-300
                "
                title={job.location || "Remote"}
              >
                <MapPin className="h-3 w-3" />

                <span className="max-w-[180px] truncate">
                  {job.location || "Remote"}
                </span>
              </span>

            </div>

          </div>

          {/* =================================================
              RIGHT SIDE - SALARY
          ================================================= */}

          <div
            className="
              hidden
              shrink-0
              text-right
              sm:block
            "
          >

            {/* Salary */}

            <div
              className="
                inline-flex
                items-center
                rounded-lg
                bg-emerald-100
                px-3
                py-2
                text-sm
                font-extrabold
                text-emerald-700

                dark:bg-emerald-950/50
                dark:text-emerald-300
              "
            >
              {salary || "Competitive"}
            </div>

            {/* Hiring Status */}

            <div
              className={`
                mt-2
                flex
                items-center
                justify-end
                gap-1
                text-xs
                font-semibold
                ${
                  job.isActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-500 dark:text-red-400"
                }
              `}
            >
              <span
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  ${
                    job.isActive
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }
                `}
              />

              {job.isActive
                ? "Actively Hiring"
                : "Position Closed"}
            </div>

          </div>

        </div>

        {/* ===================================================
            MOBILE SALARY
        =================================================== */}

        <div
          className="
            mt-4
            flex
            items-center
            justify-between
            sm:hidden
          "
        >

          <div
            className="
              rounded-lg
              bg-emerald-100
              px-3
              py-2
              text-xs
              font-extrabold
              text-emerald-700
            "
          >
            {salary || "Competitive"}
          </div>

          <div
            className={`
              flex
              items-center
              gap-1
              text-xs
              font-semibold
              ${
                job.isActive
                  ? "text-emerald-600"
                  : "text-red-500"
              }
            `}
          >
            <span
              className={`
                h-1.5
                w-1.5
                rounded-full
                ${
                  job.isActive
                    ? "bg-emerald-500"
                    : "bg-red-500"
                }
              `}
            />

            {job.isActive
              ? "Actively Hiring"
              : "Closed"}
          </div>

        </div>

        {/* ===================================================
            RECOMMENDED COURSE
        =================================================== */}

        {job.course && (
          <div
            className="
              mt-4
              flex
              items-center
              gap-2.5
              rounded-lg
              border
              border-indigo-100
              bg-indigo-50/60
              px-3
              py-2

              dark:border-indigo-900
              dark:bg-indigo-950/30
            "
          >

            <div
              className="
                flex
                h-7
                w-7
                shrink-0
                items-center
                justify-center
                rounded-md
                bg-indigo-600
                text-white
              "
            >
              <GraduationCap
                className="h-4 w-4"
              />
            </div>

            <div className="min-w-0">

              <p
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-wider
                  text-indigo-500
                "
              >
                Recommended Course
              </p>

              <p
                className="
                  max-w-[300px]
                  truncate
                  text-xs
                  font-bold
                  text-indigo-800

                  dark:text-indigo-300
                "
                title={job.course}
              >
                🎯 {job.course}
              </p>

            </div>

          </div>
        )}

        {/* ===================================================
            BOTTOM ACTION BAR
        =================================================== */}

        <div
          className="
            mt-5
            flex
            flex-wrap
            items-center
            justify-between
            gap-3
            border-t
            border-slate-100
            pt-4

            dark:border-slate-800
          "
        >

          {/* =================================================
              LEFT META
          ================================================= */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-3
              text-xs
              font-medium
              text-slate-500

              dark:text-slate-400
            "
          >

            {/* Posted Time */}

            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <Clock3
                className="
                  h-3.5
                  w-3.5
                  text-violet-500
                "
              />

              {postedTime}
            </span>

            <span className="text-slate-300">
              •
            </span>

            {/* Job Type */}

            <span
              className="
                flex
                items-center
                gap-1.5
              "
            >
              <BriefcaseBusiness
                className="
                  h-3.5
                  w-3.5
                  text-violet-500
                "
              />

              {job.type || "Full-time"}
            </span>

          </div>

          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            {/* =================================================
                EASY APPLY
            ================================================= */}

            {job.isActive &&
            job.applyLink ? (
              <a
                href={job.applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-lg
                  bg-gradient-to-r
                  from-violet-600
                  to-indigo-600
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-white
                  shadow-md
                  shadow-indigo-500/20
                  transition-all
                  hover:-translate-y-0.5
                  hover:shadow-lg
                "
              >
                <Zap
                  className="h-3.5 w-3.5"
                />

                Easy Apply
              </a>
            ) : null}

            {/* =================================================
                QUICK VIEW
            ================================================= */}

            <Link
              to={`/jobscourse/${job.id}`}
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-lg
                border
                border-indigo-200
                bg-white
                px-4
                py-2.5
                text-xs
                font-bold
                text-indigo-600
                transition-all
                hover:bg-indigo-50

                dark:border-indigo-800
                dark:bg-slate-900
                dark:text-indigo-400
              "
            >
              <Eye
                className="h-3.5 w-3.5"
              />

              Quick View
            </Link>

            {/* =================================================
                BOOKMARK
            ================================================= */}

            <button
              type="button"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-lg
                border
                border-slate-200
                bg-white
                text-slate-500
                transition-all
                hover:border-indigo-200
                hover:bg-indigo-50
                hover:text-indigo-600

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-400
              "
              title="Save job"
            >
              <Bookmark
                className="h-4 w-4"
              />
            </button>

          </div>

        </div>

      </div>
    </article>
  );
};

export default CourseJobCard;