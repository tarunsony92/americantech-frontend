import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  BriefcaseBusiness,
  Clock3,
  IndianRupee,
  Building2,
  Share2,
  Bookmark,
  CheckCircle2,
  ListChecks,
  Sparkles,
  GraduationCap,
  Tag,
  Users,
  Zap,
  Star,
  ExternalLink,
  UserRound,
} from "lucide-react";

import courseJobService from "../services/courseJobService";
import SkeletonCard from "../components/SkeletonCard";

// --------------------------------------------------
// Salary Formatter
// --------------------------------------------------

const formatSalary = (min, max, currency = "USD") => {
  if (!min && !max) return null;

  const symbolMap = {
    USD: "$",
    INR: "₹",
    EUR: "€",
    GBP: "£",
  };

  const symbol = symbolMap[currency] || `${currency} `;

  if (min && max) {
    return `${symbol}${min} - ${symbol}${max}`;
  }

  if (min) {
    return `From ${symbol}${min}`;
  }

  return `Up to ${symbol}${max}`;
};

// --------------------------------------------------
// Job Type Config
// --------------------------------------------------

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

// --------------------------------------------------
// Experience Config
// --------------------------------------------------

const experienceConfig = {
  Entry: "🌱",
  Mid: "🚀",
  Senior: "🔥",
  Lead: "👑",
};

// --------------------------------------------------
// Info Pill
// --------------------------------------------------

const InfoPill = ({ icon: Icon, label, emoji, className = "" }) => {
  if (!label) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${className}`}
    >
      {emoji ? (
        <span>{emoji}</span>
      ) : (
        Icon && <Icon className="h-3.5 w-3.5" />
      )}

      <span>{label}</span>
    </span>
  );
};

// --------------------------------------------------
// Section Header
// --------------------------------------------------

const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconClass = "text-indigo-600",
}) => {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 ${iconClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div>
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

// --------------------------------------------------
// Main Component
// --------------------------------------------------

const CourseJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // --------------------------------------------------
  // Fetch Job
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          throw new Error("Invalid job ID.");
        }

        const data = await courseJobService.getById(id);

        if (mounted) {
          setJob(data);
        }
      } catch (err) {
        console.error("Failed to fetch job:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Job not found."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchJob();

    return () => {
      mounted = false;
    };
  }, [id]);

  // --------------------------------------------------
  // Share
  // --------------------------------------------------

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: job?.title || "Job Opportunity",
          text: `${job?.title || "Job Opportunity"} at ${
            job?.company || "Company"
          }`,
          url: window.location.href,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }
    } catch {
      // User cancelled share
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="container-page py-12">
        <div className="mb-6 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600">
          <Sparkles className="h-4 w-4 animate-pulse" />
          Loading job opportunity...
        </div>

        <SkeletonCard />
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error || !job) {
    return (
      <div className="container-page flex min-h-[65vh] flex-col items-center justify-center py-20 text-center">

        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-100 to-orange-100 text-4xl dark:from-rose-950 dark:to-orange-950">
          😕
        </div>

        <h2 className="mt-5 text-2xl font-black text-slate-900 dark:text-white">
          Job not found
        </h2>

        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
          {error ||
            "The job you are looking for does not exist or is no longer available."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/jobscourse")}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Careers
        </button>
      </div>
    );
  }

  // --------------------------------------------------
  // Data
  // --------------------------------------------------

  const salary = formatSalary(
    job.salaryMin,
    job.salaryMax,
    job.currency
  );

  const applyLink =
    typeof job.applyLink === "string"
      ? job.applyLink.trim()
      : "";

  const type = typeConfig[job.type] || typeConfig["Full-time"];

  const experienceEmoji =
    experienceConfig[job.experienceLevel] || "💼";

  const responsibilities = Array.isArray(job.responsibilities)
    ? job.responsibilities
    : [];

  const requirements = Array.isArray(job.requirements)
    ? job.requirements
    : [];

  const skills = Array.isArray(job.skills) ? job.skills : [];

  const initials = (job.company || "C")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>
          {job.title} at {job.company} | American FutureTech
        </title>

        <meta
          name="description"
          content={
            job.description
              ? job.description.slice(0, 160)
              : `${job.title} opportunity at ${job.company}.`
          }
        />
      </Helmet>

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="relative overflow-hidden bg-slate-950">

        {/* Gradient blobs */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/20 blur-3xl" />

        <div className="relative container-page py-8 sm:py-12">

          {/* Top actions */}
          <div className="flex items-center justify-between">

            <Link
              to="/jobscourse"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:-translate-x-1 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all jobs
            </Link>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Share2 className="h-3.5 w-3.5" />
                {copied ? "Copied!" : "Share"}
              </button>

              <button
                type="button"
                onClick={() => setSaved((value) => !value)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold backdrop-blur transition ${
                  saved
                    ? "border-white bg-white text-indigo-700"
                    : "border-white/10 bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Bookmark
                  className={`h-3.5 w-3.5 ${
                    saved ? "fill-current" : ""
                  }`}
                />

                {saved ? "Saved" : "Save"}
              </button>

            </div>
          </div>

          {/* Header */}
          <div className="mt-8 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

            <div className="min-w-0">

              <div className="flex items-start gap-4">

                {/* Company Logo */}
                {/* <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-xl font-black text-white shadow-2xl shadow-indigo-900/40">
                  {initials}
                </div> */}


               <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-2xl shadow-indigo-900/20 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
  {job.imageUrl ? (
    <img
      src={job.imageUrl}
      alt={`${job.company} logo`}
      className="h-full w-full object-contain"
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.parentElement.innerHTML = `
          <span class="text-xl font-black text-indigo-600">
            ${initials}
          </span>
        `;
      }}
    />
  ) : (
    <span className="text-xl font-black text-indigo-600">
      {initials}
    </span>
  )}
</div>

                <div className="min-w-0">

                  {/* Company */}
                  <div className="flex flex-wrap items-center gap-2">

                    <Building2 className="h-4 w-4 text-indigo-300" />

                    <span className="text-sm font-semibold text-indigo-200">
                      {job.company}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        job.isActive
                          ? "bg-emerald-400/15 text-emerald-300"
                          : "bg-red-400/15 text-red-300"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          job.isActive
                            ? "bg-emerald-400"
                            : "bg-red-400"
                        }`}
                      />

                      {job.isActive ? "Actively Hiring" : "Position Closed"}
                    </span>

                  </div>

                  {/* Title */}
                  <h1 className="mt-2 max-w-4xl text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {job.title}
                  </h1>

                </div>
              </div>

              {/* Pills */}
              <div className="mt-6 flex flex-wrap gap-2">

                <InfoPill
                  emoji={type.emoji}
                  label={job.type}
                  className={type.className}
                />

                <InfoPill
                  emoji={experienceEmoji}
                  label={job.experienceLevel}
                  className="border-white/10 bg-white/10 text-white"
                />

                <InfoPill
                  icon={MapPin}
                  label={job.location || "Remote"}
                  className="border-white/10 bg-white/10 text-white"
                />

                {job.category && (
                  <InfoPill
                    icon={Tag}
                    label={job.category}
                    className="border-white/10 bg-white/10 text-white"
                  />
                )}

                {salary && (
                  <InfoPill
                    icon={IndianRupee}
                    label={salary}
                    className="border-emerald-300/30 bg-emerald-400/15 text-emerald-200"
                  />
                )}

              </div>

            </div>

            {/* Apply */}
            <div className="shrink-0">

              {applyLink ? (
                <a
                  href={applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-indigo-700 shadow-xl transition hover:-translate-y-0.5 hover:shadow-2xl sm:w-auto"
                >
                  Apply Now
                  <ExternalLink className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/20 px-6 py-3.5 text-sm font-bold text-white/50 sm:w-auto"
                >
                  Application Unavailable
                </button>
              )}

            </div>

          </div>
        </div>
      </section>

      {/* ==================================================
          BODY
      ================================================== */}

      <section className="container-page py-10 sm:py-12">

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">

          {/* ==================================================
              MAIN
          ================================================== */}

          <main className="min-w-0 space-y-6">

            {/* Course */}
            {job.course && (
              <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 shadow-sm dark:border-indigo-900/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-violet-950/40">

                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                    <GraduationCap className="h-6 w-6" />
                  </div>

                  <div className="min-w-0">

                    <p className="text-[10px] font-black uppercase tracking-wider text-indigo-500">
                      Recommended Course
                    </p>

                    <h2
                      className="mt-1 truncate text-base font-black text-indigo-950 dark:text-indigo-100"
                      title={job.course}
                    >
                      🎯 {job.course}
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Build the skills required for this opportunity.
                    </p>

                  </div>

                </div>
              </section>
            )}

            {/* Description */}
            {job.description && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <SectionHeader
                  icon={Sparkles}
                  title="About the Role"
                  subtitle="What this opportunity is about"
                />

                <div className="text-sm leading-7 text-slate-600 dark:text-slate-300">
                  <p className="whitespace-pre-line">
                    {job.description}
                  </p>
                </div>

              </section>
            )}

            {/* Responsibilities */}
            {responsibilities.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <SectionHeader
                  icon={ListChecks}
                  title="Responsibilities"
                  subtitle={`${responsibilities.length} key responsibilities`}
                />

                <div className="space-y-3">

                  {responsibilities.map((item, index) => (
                    <div
                      key={index}
                      className="group flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:border-indigo-100 hover:bg-indigo-50/50 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-indigo-900"
                    >

                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-[10px] font-black text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                        {index + 1}
                      </span>

                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {item}
                      </p>

                    </div>
                  ))}

                </div>
              </section>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <SectionHeader
                  icon={CheckCircle2}
                  title="Requirements"
                  subtitle={`${requirements.length} requirements`}
                  iconClass="text-emerald-600"
                />

                <div className="space-y-3">

                  {requirements.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />

                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {item}
                      </p>

                    </div>
                  ))}

                </div>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">

                <SectionHeader
                  icon={Zap}
                  title="Skills Required"
                  subtitle={`${skills.length} skills`}
                  iconClass="text-amber-500"
                />

                <div className="flex flex-wrap gap-2">

                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
                    >
                      #{skill}
                    </span>
                  ))}

                </div>
              </section>
            )}

          </main>

          {/* ==================================================
              SIDEBAR
          ================================================== */}

          <aside className="h-fit lg:sticky lg:top-24">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              {/* Sidebar Header */}
              <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 dark:border-slate-800 dark:from-indigo-950/40 dark:to-violet-950/40">

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                    <Star className="h-4 w-4 fill-current" />
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      Job Overview
                    </h3>

                    <p className="text-[10px] text-slate-400">
                      Quick information
                    </p>
                  </div>

                </div>

              </div>

              {/* Overview */}
              <div className="p-5">

                <div className="space-y-4">

                  {/* Company */}
                  <div className="flex items-start gap-3">

                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Company
                      </p>

                      <p className="mt-0.5 break-words text-sm font-bold text-slate-800 dark:text-slate-200">
                        {job.company || "-"}
                      </p>
                    </div>

                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-3">

                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Location
                      </p>

                      <p className="mt-0.5 break-words text-sm font-bold text-slate-800 dark:text-slate-200">
                        {job.location || "Remote"}
                      </p>
                    </div>

                  </div>

                  {/* Job Type */}
                  <div className="flex items-start gap-3">

                    <BriefcaseBusiness className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Job Type
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                        {job.type || "-"}
                      </p>
                    </div>

                  </div>

                  {/* Experience */}
                  <div className="flex items-start gap-3">

                    <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Experience
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                        {experienceEmoji} {job.experienceLevel || "-"}
                      </p>
                    </div>

                  </div>

                  {/* Category */}
                  {job.category && (
                    <div className="flex items-start gap-3">

                      <Tag className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Category
                        </p>

                        <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                          {job.category}
                        </p>
                      </div>

                    </div>
                  )}

                  {/* Salary */}
                  {salary && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900 dark:bg-emerald-950/40">

                      <div className="flex items-center gap-2">

                        <IndianRupee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                            Salary
                          </p>

                          <p className="mt-0.5 text-sm font-black text-emerald-700 dark:text-emerald-300">
                            {salary}
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* Posted By */}
                  {/* {job.postedBy && (
                    <div className="flex items-start gap-3">

                      <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />

                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Posted By
                        </p>

                        <p className="mt-0.5 text-sm font-bold text-slate-800 dark:text-slate-200">
                          Recruiter #{job.postedBy}
                        </p>
                      </div>

                    </div>
                  )} */}

                  {/* Status */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-800/50">

                    <span className="text-xs font-semibold text-slate-500">
                      Status
                    </span>

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        job.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          job.isActive
                            ? "bg-emerald-500"
                            : "bg-red-500"
                        }`}
                      />

                      {job.isActive ? "Active" : "Closed"}
                    </span>

                  </div>

                </div>

                {/* Apply */}
                <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">

                  {applyLink ? (
                    <a
                      href={applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-black text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:shadow-xl"
                    >
                      Apply Now
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-200 py-3 text-sm font-bold text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                    >
                      Application Link Unavailable
                    </button>
                  )}

                  <p className="mt-3 text-center text-[10px] text-slate-400">
                    🔒 Your information is safe & confidential
                  </p>

                </div>

              </div>
            </div>

            {/* Bottom CTA */}
            {/* <div className="mt-4 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-5 text-white shadow-lg">

              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />

                <h3 className="text-sm font-black">
                  Interested in this role?
                </h3>
              </div>

              <p className="mt-2 text-xs leading-5 text-indigo-100">
                Review the requirements and skills before applying.
              </p>

              {applyLink && (
                <a
                  href={applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-xs font-black text-indigo-700 transition hover:bg-indigo-50"
                >
                  Apply for this position
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              )}

            </div> */}

          </aside>
        </div>
      </section>
    </>
  );
};

export default CourseJobDetails;