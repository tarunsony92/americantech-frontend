// pages/JobCareers.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Filter,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";

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
    <article
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-slate-200/80
        bg-white
        shadow-[0_4px_24px_rgba(15,23,42,0.05)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-indigo-200
        hover:shadow-[0_16px_40px_rgba(79,70,229,0.12)]
        dark:border-slate-800
        dark:bg-slate-900
        dark:hover:border-indigo-800
      "
    >
      {/* Top accent */}
      <div
        className="
          absolute inset-x-0 top-0 h-1
          bg-gradient-to-r
          from-indigo-500
          via-violet-500
          to-fuchsia-500
          opacity-0
          transition-opacity duration-300
          group-hover:opacity-100
        "
      />

      <CourseJobCard job={job} />

      {/* Bottom action
      <div
        className="
          border-t border-slate-100
          bg-slate-50/60
          px-5 py-3
          dark:border-slate-800
          dark:bg-slate-950/40
        "
      >
        <Link
          to={`/jobscourse/${job.id}`}
          className="
            flex items-center justify-between
            text-sm font-semibold
            text-indigo-600
            transition-colors
            hover:text-indigo-700
            dark:text-indigo-400
            dark:hover:text-indigo-300
          "
        >
          <span>View job details</span>

          <span
            className="
              flex h-7 w-7
              items-center justify-center
              rounded-full
              bg-white
              shadow-sm
              ring-1 ring-slate-200
              transition-all
              group-hover:translate-x-1
              group-hover:bg-indigo-50
              group-hover:ring-indigo-200
              dark:bg-slate-800
              dark:ring-slate-700
              dark:group-hover:bg-indigo-950
            "
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div> */}
    </article>
  );
};

// --------------------------------------------------
// Stat Card
// --------------------------------------------------

const StatCard = ({ icon: Icon, value, label }) => {
  return (
    <div
      className="
        flex items-center gap-3
        rounded-xl
        border border-white/10
        bg-white/10
        px-4 py-3
        backdrop-blur-md
      "
    >
      <div
        className="
          flex h-9 w-9 shrink-0
          items-center justify-center
          rounded-lg
          bg-white/15
        "
      >
        <Icon className="h-4.5 w-4.5 text-white" />
      </div>

      <div>
        <p className="text-lg font-bold text-white">
          {value}
        </p>

        <p className="text-xs text-indigo-100">
          {label}
        </p>
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
  // Clear Filters
  // --------------------------------------------------

  const clearFilters = () => {
    setActiveFilters({});
  };

  // --------------------------------------------------
  // Filter Visible Jobs
  // --------------------------------------------------

  const visibleJobs = items.filter((job) => {
    const typeFilters = activeFilters.Type || [];
    const experienceFilters =
      activeFilters.Experience || [];

    const typeMatch =
      typeFilters.length === 0 ||
      typeFilters.includes(job.type);

    const experienceMatch =
      experienceFilters.length === 0 ||
      experienceFilters.includes(job.experienceLevel);

    return typeMatch && experienceMatch;
  });

  const activeFilterCount = Object.values(activeFilters)
    .flat()
    .length;

  const totalJobs = meta?.total ?? items.length;

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

      {/* --------------------------------------------------
          Hero
      -------------------------------------------------- */}

      <section
        className="
          relative overflow-hidden
          bg-slate-950
        "
      >
        {/* Background gradients */}
        <div
          className="
            pointer-events-none absolute
            -left-24 -top-24
            h-72 w-72
            rounded-full
            bg-indigo-600/30
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none absolute
            -right-24 top-10
            h-80 w-80
            rounded-full
            bg-fuchsia-600/20
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none absolute
            bottom-0 left-1/2
            h-64 w-64
            -translate-x-1/2
            rounded-full
            bg-violet-600/20
            blur-3xl
          "
        />

        <div
          className="
            container-page
            relative
            py-14 sm:py-18 lg:py-20
          "
        >
          <div className="max-w-3xl">
            {/* Badge */}
            <div
              className="
                mb-5 inline-flex items-center gap-2
                rounded-full
                border border-indigo-400/20
                bg-indigo-400/10
                px-3.5 py-1.5
                text-xs font-semibold
                text-indigo-200
                backdrop-blur
              "
            >
              <Sparkles className="h-3.5 w-3.5" />

              Build your future with us
            </div>

            {/* Heading */}
            <h1
              className="
                text-4xl
                font-black
                tracking-tight
                text-white
                sm:text-5xl
                lg:text-6xl
              "
            >
              Find a role where
              <span
                className="
                  block
                  bg-gradient-to-r
                  from-indigo-400
                  via-violet-400
                  to-fuchsia-400
                  bg-clip-text
                  text-transparent
                "
              >
                your skills matter.
              </span>
            </h1>

            <p
              className="
                mt-5
                max-w-2xl
                text-base
                leading-7
                text-slate-300
                sm:text-lg
              "
            >
              Explore opportunities across technology, data,
              cloud, security, design and more. Find the role
              that fits your experience and career goals.
            </p>

            {/* Stats */}
            <div
              className="
                mt-8
                grid
                grid-cols-1
                gap-3
                sm:grid-cols-3
              "
            >
              <StatCard
                icon={BriefcaseBusiness}
                value={totalJobs}
                label="Open positions"
              />

              <StatCard
                icon={CheckCircle2}
                value="5+"
                label="Job types"
              />

              <StatCard
                icon={MapPin}
                value="Global"
                label="Career opportunities"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------
          Page Header / Breadcrumb
      -------------------------------------------------- */}

      <PageHeader
        title="Explore Job Openings"
        subtitle="Find roles that match your skills and experience."
        breadcrumbItems={[
          {
            label: "Careers",
          },
        ]}
      />

      {/* --------------------------------------------------
          Main Section
      -------------------------------------------------- */}

      <section
        className="
          container-page
          py-10 sm:py-12 lg:py-14
        "
      >
        {/* Search Header */}
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border border-slate-200
            bg-white
            p-4
            shadow-sm
            dark:border-slate-800
            dark:bg-slate-900
            sm:p-5
          "
        >
          <div
            className="
              absolute
              -right-16
              -top-16
              h-36 w-36
              rounded-full
              bg-indigo-500/5
              blur-2xl
            "
          />

          <div
            className="
              relative
              flex flex-col
              gap-4
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* Search */}
            <div className="w-full lg:max-w-xl">
              <div className="relative">
                <Search
                  className="
                    pointer-events-none
                    absolute left-3.5 top-1/2
                    h-4.5 w-4.5
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <div className="[&_input]:pl-10">
                  <SearchBar
                    value={params.search || ""}
                    onChange={handleSearch}
                    placeholder="Search jobs, companies, skills..."
                  />
                </div>
              </div>
            </div>

            {/* Result */}
            {!loading && (
              <div
                className="
                  flex items-center gap-3
                  text-sm
                  text-slate-500
                  dark:text-slate-400
                "
              >
                <div
                  className="
                    flex h-9 w-9
                    items-center justify-center
                    rounded-lg
                    bg-indigo-50
                    text-indigo-600
                    dark:bg-indigo-950
                    dark:text-indigo-400
                  "
                >
                  <BriefcaseBusiness className="h-4 w-4" />
                </div>

                <div>
                  <p
                    className="
                      font-bold
                      text-slate-900
                      dark:text-white
                    "
                  >
                    {visibleJobs.length} roles found
                  </p>

                  <p className="text-xs">
                    Matching current filters
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {activeFilterCount > 0 && (
          <div
            className="
              mt-5
              flex flex-wrap
              items-center gap-2
            "
          >
            <div
              className="
                mr-1
                flex items-center gap-1.5
                text-xs font-semibold
                text-slate-500
              "
            >
              <Filter className="h-3.5 w-3.5" />

              Active filters:
            </div>

            {Object.entries(activeFilters).map(
              ([group, values]) =>
                values.map((value) => (
                  <button
                    key={`${group}-${value}`}
                    type="button"
                    onClick={() =>
                      handleFilterChange(group, value)
                    }
                    className="
                      inline-flex items-center gap-1.5
                      rounded-full
                      border border-indigo-200
                      bg-indigo-50
                      px-3 py-1.5
                      text-xs font-semibold
                      text-indigo-700
                      transition-colors
                      hover:bg-indigo-100
                      dark:border-indigo-800
                      dark:bg-indigo-950
                      dark:text-indigo-300
                    "
                  >
                    {value}

                    <X className="h-3 w-3" />
                  </button>
                ))
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="
                ml-1
                text-xs font-semibold
                text-slate-500
                underline-offset-2
                hover:text-red-500
                hover:underline
              "
            >
              Clear all
            </button>
          </div>
        )}

        {/* --------------------------------------------------
            Content Layout
        -------------------------------------------------- */}

        <div
          className="
            mt-8
            grid
            grid-cols-1
            gap-8
            lg:grid-cols-[260px_minmax(0,1fr)]
            xl:grid-cols-[280px_minmax(0,1fr)]
          "
        >
          {/* Sidebar */}
          <aside>
            <div
              className="
                sticky top-24
                overflow-hidden
                rounded-2xl
                border border-slate-200
                bg-white
                shadow-sm
                dark:border-slate-800
                dark:bg-slate-900
              "
            >
              <div
                className="
                  flex items-center justify-between
                  border-b border-slate-100
                  px-5 py-4
                  dark:border-slate-800
                "
              >
                <div className="flex items-center gap-2">
                  <div
                    className="
                      flex h-8 w-8
                      items-center justify-center
                      rounded-lg
                      bg-indigo-50
                      text-indigo-600
                      dark:bg-indigo-950
                      dark:text-indigo-400
                    "
                  >
                    <Filter className="h-4 w-4" />
                  </div>

                  <div>
                    <h2
                      className="
                        text-sm font-bold
                        text-slate-900
                        dark:text-white
                      "
                    >
                      Filter Jobs
                    </h2>

                    <p
                      className="
                        text-[11px]
                        text-slate-400
                      "
                    >
                      Refine your search
                    </p>
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <span
                    className="
                      flex h-6 min-w-6
                      items-center justify-center
                      rounded-full
                      bg-indigo-600
                      px-1.5
                      text-[11px]
                      font-bold
                      text-white
                    "
                  >
                    {activeFilterCount}
                  </span>
                )}
              </div>

              <div className="p-4">
                <CourseFilters
                  filters={FILTER_GROUPS}
                  activeFilters={activeFilters}
                  onChange={handleFilterChange}
                />
              </div>

              {activeFilterCount > 0 && (
                <div
                  className="
                    border-t border-slate-100
                    p-4
                    dark:border-slate-800
                  "
                >
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="
                      flex w-full
                      items-center justify-center
                      gap-2
                      rounded-lg
                      border border-slate-200
                      px-3 py-2
                      text-xs font-semibold
                      text-slate-600
                      transition-colors
                      hover:border-red-200
                      hover:bg-red-50
                      hover:text-red-600
                      dark:border-slate-700
                      dark:text-slate-300
                      dark:hover:border-red-900
                      dark:hover:bg-red-950/40
                      dark:hover:text-red-400
                    "
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* Jobs */}
          <div className="min-w-0">
            {/* Section heading */}
            <div
              className="
                mb-5
                flex flex-col gap-2
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <div
                  className="
                    flex items-center gap-2
                    text-xs font-bold
                    uppercase tracking-wider
                    text-indigo-600
                    dark:text-indigo-400
                  "
                >
                  <span
                    className="
                      h-1.5 w-1.5
                      rounded-full
                      bg-indigo-500
                    "
                  />

                  Latest opportunities
                </div>

                <h2
                  className="
                    mt-1
                    text-xl font-extrabold
                    text-slate-900
                    dark:text-white
                  "
                >
                  Available Positions
                </h2>
              </div>

              {!loading && meta && (
                <p
                  className="
                    text-xs
                    text-slate-400
                  "
                >
                  Page {meta.page} of {meta.totalPages}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div
                className="
                  mb-6
                  flex items-start gap-3
                  rounded-xl
                  border border-red-200
                  bg-red-50
                  p-4
                  text-sm
                  text-red-700
                  dark:border-red-900
                  dark:bg-red-950/40
                  dark:text-red-300
                "
              >
                <div
                  className="
                    mt-0.5
                    h-2 w-2
                    shrink-0
                    rounded-full
                    bg-red-500
                  "
                />

                <span>{error}</span>
              </div>
            )}

            {/* Jobs Grid */}
           <div className="grid grid-cols-1 gap-5">
              {loading ? (
                Array.from({ length: 6 }).map(
                  (_, index) => (
                    <SkeletonCard key={index} />
                  )
                )
              ) : (
                visibleJobs.map((job) => (
                  <JobCardWrapper
                    key={job.id}
                    job={job}
                  />
                ))
              )}
            </div>

            {/* Empty State */}
            {!loading &&
              !error &&
              visibleJobs.length === 0 && (
                <div
                  className="
                    mt-2
                    overflow-hidden
                    rounded-2xl
                    border border-dashed
                    border-slate-300
                    bg-slate-50/70
                    px-6 py-16
                    text-center
                    dark:border-slate-700
                    dark:bg-slate-900/50
                  "
                >
                  <div
                    className="
                      mx-auto
                      flex h-16 w-16
                      items-center justify-center
                      rounded-2xl
                      bg-white
                      shadow-sm
                      ring-1 ring-slate-200
                      dark:bg-slate-800
                      dark:ring-slate-700
                    "
                  >
                    <Search
                      className="
                        h-7 w-7
                        text-slate-400
                      "
                    />
                  </div>

                  <h3
                    className="
                      mt-5
                      text-lg font-bold
                      text-slate-800
                      dark:text-white
                    "
                  >
                    No jobs found
                  </h3>

                  <p
                    className="
                      mx-auto mt-2
                      max-w-md
                      text-sm leading-6
                      text-slate-500
                      dark:text-slate-400
                    "
                  >
                    We couldn't find any positions matching
                    your current search or filters. Try
                    changing your criteria.
                  </p>

                  {(activeFilterCount > 0 ||
                    params.search) && (
                    <button
                      type="button"
                      onClick={() => {
                        clearFilters();

                        handleSearch("");
                      }}
                      className="
                        mt-6
                        inline-flex items-center gap-2
                        rounded-lg
                        bg-indigo-600
                        px-4 py-2.5
                        text-sm font-semibold
                        text-white
                        shadow-sm
                        transition-all
                        hover:bg-indigo-700
                        hover:shadow-lg
                      "
                    >
                      Reset search

                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}

            {/* Pagination */}
            {!loading &&
              meta &&
              meta.totalPages > 1 && (
                <div
                  className="
                    mt-10
                    flex justify-center
                    border-t border-slate-100
                    pt-7
                    dark:border-slate-800
                  "
                >
                  <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------
          Bottom CTA
      -------------------------------------------------- */}

      {/* <section className="container-page pb-14">
        <div
          className="
            relative overflow-hidden
            rounded-3xl
            bg-gradient-to-br
            from-indigo-600
            via-violet-600
            to-fuchsia-600
            px-6 py-10
            shadow-xl
            shadow-indigo-500/10
            sm:px-10
          "
        >
          <div
            className="
              pointer-events-none absolute
              -right-20 -top-20
              h-64 w-64
              rounded-full
              bg-white/10
              blur-2xl
            "
          />

          <div
            className="
              pointer-events-none absolute
              -bottom-24 -left-10
              h-56 w-56
              rounded-full
              bg-white/10
              blur-2xl
            "
          />

          <div
            className="
              relative
              flex flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div className="max-w-2xl">
              <div
                className="
                  mb-3
                  flex items-center gap-2
                  text-xs font-bold
                  uppercase tracking-wider
                  text-indigo-100
                "
              >
                <Sparkles className="h-4 w-4" />

                Your next opportunity
              </div>

              <h2
                className="
                  text-2xl font-extrabold
                  text-white
                  sm:text-3xl
                "
              >
                Don't see the right role?
              </h2>

              <p
                className="
                  mt-2
                  text-sm leading-6
                  text-indigo-100
                  sm:text-base
                "
              >
                Keep checking our careers page for new
                opportunities that match your skills.
              </p>
            </div>

            <Link
              to="/"
              className="
                inline-flex
                shrink-0
                items-center justify-center
                gap-2
                rounded-xl
                bg-white
                px-5 py-3
                text-sm font-bold
                text-indigo-700
                shadow-lg
                transition-all
                hover:-translate-y-0.5
                hover:shadow-xl
              "
            >
              Explore more

              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section> */}
    </>
  );
};

export default JobCareers;