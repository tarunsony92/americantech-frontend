
// pages/JobCareers.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";

import PageHeader from "../components/PageHeader";
import CourseJobCard from "../components/CourseJobCard";
import CourseFilters from "../components/CourseFilters";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import SkeletonCard from "../components/SkeletonCard";

import courseJobService from "../services/courseJobService";
import useResourceList from "../hooks/useResourceList";

// --------------------------------------------------
// Filters
// --------------------------------------------------

const FILTER_GROUPS = [
  {
    title: "Type",
    options: [
      "Full-time",
      "Part-time",
      "Contract",
      "Internship",
      "Remote",
    ],
  },
  {
    title: "Experience",
    options: [
      "Entry",
      "Mid",
      "Senior",
      "Lead",
    ],
  },
];

// --------------------------------------------------
// Job Card Wrapper
// --------------------------------------------------

const JobCardWrapper = ({ job }) => {
  return (
    <div
      className="
        group relative overflow-hidden rounded-2xl
        border border-slate-200
        bg-white shadow-sm
        transition-all duration-300
        hover:-translate-y-1
        hover:border-indigo-200
        hover:shadow-xl
        hover:shadow-indigo-500/10
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-indigo-800
      "
    >
      {/* Job Card */}
      <CourseJobCard job={job} />

      {/* View More */}
      <div className="border-t border-slate-100 p-4 dark:border-slate-800">
        <Link
          to={`/jobscourse/${job.id}`}
          className="
            flex w-full items-center justify-center gap-1.5
            rounded-lg
            bg-slate-50
            py-2
            text-sm font-medium
            text-indigo-600
            transition-all
            hover:bg-indigo-50
            group-hover:gap-2.5
            dark:bg-slate-800
            dark:text-indigo-400
            dark:hover:bg-indigo-950
          "
        >
          View More

          <ArrowRight
            className="
              h-3.5 w-3.5
              transition-transform
              group-hover:translate-x-0.5
            "
          />
        </Link>
      </div>
    </div>
  );
};

// --------------------------------------------------
// Job Careers Page
// --------------------------------------------------

const JobCareers = () => {
  const {
    items,
    meta,
    params,
    setParams,
    loading,
    error,
  } = useResourceList(courseJobService, {
    limit: 9,
  });

  const [activeFilters, setActiveFilters] = useState({});

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const handleSearch = (value) => {
    setParams((prev) => ({
      ...prev,
      search: value,
      page: 1,
    }));
  };

  // --------------------------------------------------
  // Pagination
  // --------------------------------------------------

  const handlePageChange = (page) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  };

  // --------------------------------------------------
  // Filters
  // --------------------------------------------------

  const handleFilterChange = (groupTitle, option) => {
    setActiveFilters((prev) => {
      const current = prev[groupTitle] || [];

      const next = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];

      return {
        ...prev,
        [groupTitle]: next,
      };
    });
  };

  // --------------------------------------------------
  // Filter Visible Jobs
  // --------------------------------------------------

  const visibleJobs = items.filter((job) => {
    const typeFilters = activeFilters.Type || [];
    const experienceFilters = activeFilters.Experience || [];

    const typeMatch =
      typeFilters.length === 0 ||
      typeFilters.includes(job.type);

    const experienceMatch =
      experienceFilters.length === 0 ||
      experienceFilters.includes(job.experienceLevel);

    return typeMatch && experienceMatch;
  });

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <>
      {/* SEO */}
      <Helmet>
        <title>Careers | American FutureTech</title>

        <meta
          name="description"
          content="Explore current job openings and career opportunities at American FutureTech."
        />
      </Helmet>

      {/* Page Header */}
      <PageHeader
        title="Explore Job Openings"
        subtitle="Find roles that match your skills across web, data, cloud, security and design."
        breadcrumbItems={[
          {
            label: "Careers",
          },
        ]}
      />

      {/* Main Section */}
      <section
        className="
          container-page
          grid grid-cols-1
          gap-8
          py-12
          lg:grid-cols-[280px_1fr]
        "
      >
        {/* --------------------------------------------------
            Filters
        -------------------------------------------------- */}

        <CourseFilters
          filters={FILTER_GROUPS}
          activeFilters={activeFilters}
          onChange={handleFilterChange}
        />

        {/* --------------------------------------------------
            Jobs Content
        -------------------------------------------------- */}

        <div>
          {/* Search + Count */}
          <div
            className="
              mb-6
              flex flex-col gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* Search */}
            <div className="max-w-md flex-1">
              <SearchBar
                value={params.search || ""}
                onChange={handleSearch}
                placeholder="Search jobs, companies, skills..."
              />
            </div>

            {/* Count */}
            {!loading && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {visibleJobs.length}
                </span>{" "}
                roles found
              </p>
            )}
          </div>

          {/* --------------------------------------------------
              Error
          -------------------------------------------------- */}

          {error && (
            <p
              className="
                mb-6
                rounded-lg
                bg-red-50
                p-3
                text-sm
                text-red-600
                dark:bg-red-950
                dark:text-red-300
              "
            >
              {error}
            </p>
          )}

          {/* --------------------------------------------------
              Jobs Grid
          -------------------------------------------------- */}

          <div
            className="
              grid grid-cols-1
              gap-6
              sm:grid-cols-2
              xl:grid-cols-3
            "
          >
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            ) : (
              visibleJobs.map((job) => (
                <JobCardWrapper
                  key={job.id}
                  job={job}
                />
              ))
            )}
          </div>

          {/* --------------------------------------------------
              No Jobs
          -------------------------------------------------- */}

          {!loading &&
            !error &&
            visibleJobs.length === 0 && (
              <div
                className="
                  mt-10
                  flex flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border border-dashed
                  border-slate-200
                  py-16
                  text-center
                  dark:border-slate-800
                "
              >
                <p
                  className="
                    text-lg
                    font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  No jobs match your filters
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}

          {/* --------------------------------------------------
              Pagination
          -------------------------------------------------- */}

          {!loading &&
            meta &&
            meta.totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
        </div>
      </section>
    </>
  );
};

export default JobCareers;

