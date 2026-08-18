// pages/JobDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Clock,
  IndianRupee,
  CheckCircle2,
  ListChecks,
  Sparkles,
  Building2,
  ArrowRight,
} from "lucide-react";

import courseJobService from "../services/courseJobService";
import SkeletonCard from "../components/SkeletonCard";

// --------------------------------------------------
// Salary Formatter
// --------------------------------------------------
const formatSalary = (min, max, currency = "USD") => {
  if (min == null && max == null) return null;

  const symbol =
    currency === "INR"
      ? "₹"
      : currency === "USD"
      ? "$"
      : `${currency} `;

  const fmt = (n) => new Intl.NumberFormat("en-IN").format(n);

  if (min != null && max != null) {
    return `${symbol}${fmt(min)} - ${symbol}${fmt(max)}`;
  }

  return `${symbol}${fmt(min ?? max)}`;
};

// --------------------------------------------------
// Info Pill
// --------------------------------------------------
const InfoPill = ({ icon: Icon, label, tone }) => {
  if (!label) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium ${tone}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
};

// --------------------------------------------------
// Job Details Page
// --------------------------------------------------
const CourseJobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  // Loading State
  // --------------------------------------------------
  if (loading) {
    return (
      <div className="container-page py-12">
        <SkeletonCard />
      </div>
    );
  }

  // --------------------------------------------------
  // Error State
  // --------------------------------------------------
  if (error || !job) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Job not found
          </h2>

          <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-300">
            {error || "The job you are looking for does not exist."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/careers")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Salary
  // --------------------------------------------------
  const salary = formatSalary(
    job.salaryMin,
    job.salaryMax,
    job.currency
  );

  // --------------------------------------------------
  // Apply Link
  // --------------------------------------------------
  const applyLink = job.applyLink?.trim();

  return (
    <>
      {/* --------------------------------------------------
          SEO
      -------------------------------------------------- */}
      <Helmet>
        <title>
          {job.title} at {job.company} | American FutureTech
        </title>

        <meta
          name="description"
          content={
            job.description
              ? job.description.slice(0, 160)
              : `${job.title} job opportunity at ${job.company}.`
          }
        />
      </Helmet>

      {/* --------------------------------------------------
          HERO SECTION
      -------------------------------------------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

        <div className="container-page relative py-14 text-white">
          {/* Back Link */}
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-100 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all jobs
          </Link>

          {/* Job Header */}
          <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {/* Company */}
              <div className="flex items-center gap-2 text-indigo-100">
                <Building2 className="h-4 w-4" />

                <span className="text-sm font-medium">
                  {job.company || "Company"}
                </span>
              </div>

              {/* Title */}
              <h1 className="mt-2 text-3xl font-bold sm:text-4xl lg:text-5xl">
                {job.title}
              </h1>
            </div>

            {/* Apply Button */}
            {applyLink ? (
              <a
                href={applyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-white/60 px-6 py-3 text-sm font-semibold text-indigo-900/60"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Job Pills */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            {job.type && (
              <InfoPill
                icon={Briefcase}
                label={job.type}
                tone="bg-white/15 text-white"
              />
            )}

            {job.experienceLevel && (
              <InfoPill
                icon={Clock}
                label={job.experienceLevel}
                tone="bg-white/15 text-white"
              />
            )}

            {job.location && (
              <InfoPill
                icon={MapPin}
                label={job.location}
                tone="bg-white/15 text-white"
              />
            )}

            {salary && (
              <InfoPill
                icon={IndianRupee}
                label={salary}
                tone="bg-white text-indigo-700"
              />
            )}

            {job.category && (
              <InfoPill
                icon={Sparkles}
                label={job.category}
                tone="bg-white/15 text-white"
              />
            )}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------
          BODY
      -------------------------------------------------- */}
      <section className="container-page grid grid-cols-1 gap-8 py-12 lg:grid-cols-[1fr_320px]">
        {/* --------------------------------------------------
            MAIN CONTENT
        -------------------------------------------------- */}
        <div className="space-y-10">
          {/* About Role */}
          {job.description && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                About the role
              </h2>

              <p className="whitespace-pre-line leading-relaxed text-slate-600 dark:text-slate-300">
                {job.description}
              </p>
            </div>
          )}

          {/* Responsibilities */}
          {Array.isArray(job.responsibilities) &&
            job.responsibilities.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <ListChecks className="h-5 w-5 text-indigo-600" />
                  Responsibilities
                </h2>

                <ul className="space-y-2.5">
                  {job.responsibilities.map((responsibility, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300"
                    >
                      <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-indigo-500" />

                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Requirements */}
          {Array.isArray(job.requirements) &&
            job.requirements.length > 0 && (
              <div>
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  Requirements
                </h2>

                <ul className="space-y-2.5">
                  {job.requirements.map((requirement, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />

                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Skills */}
          {Array.isArray(job.skills) && job.skills.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                Skills required
              </h2>

              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* --------------------------------------------------
            SIDEBAR
        -------------------------------------------------- */}
        <aside className="h-fit space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-24">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Job Overview
          </h3>

          <dl className="space-y-3 text-sm">
            {/* Company */}
            <div className="flex items-start justify-between gap-4">
              <dt className="text-slate-500">Company</dt>

              <dd className="text-right font-medium text-slate-900 dark:text-white">
                {job.company || "-"}
              </dd>
            </div>

            {/* Location */}
            <div className="flex items-start justify-between gap-4">
              <dt className="text-slate-500">Location</dt>

              <dd className="text-right font-medium text-slate-900 dark:text-white">
                {job.location || "-"}
              </dd>
            </div>

            {/* Type */}
            <div className="flex items-start justify-between gap-4">
              <dt className="text-slate-500">Type</dt>

              <dd className="text-right font-medium text-slate-900 dark:text-white">
                {job.type || "-"}
              </dd>
            </div>

            {/* Experience */}
            <div className="flex items-start justify-between gap-4">
              <dt className="text-slate-500">Experience</dt>

              <dd className="text-right font-medium text-slate-900 dark:text-white">
                {job.experienceLevel || "-"}
              </dd>
            </div>

            {/* Category */}
            {job.category && (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Category</dt>

                <dd className="text-right font-medium text-slate-900 dark:text-white">
                  {job.category}
                </dd>
              </div>
            )}

            {/* Salary */}
            {salary && (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-slate-500">Salary</dt>

                <dd className="text-right font-medium text-slate-900 dark:text-white">
                  {salary}
                </dd>
              </div>
            )}
          </dl>

          {/* Sidebar Apply Button */}
          {applyLink ? (
            <a
              href={applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-300 py-3 text-sm font-semibold text-slate-500 dark:bg-slate-700 dark:text-slate-400"
            >
              Application Link Unavailable
            </button>
          )}
        </aside>
      </section>
    </>
  );
};

export default CourseJobDetails;