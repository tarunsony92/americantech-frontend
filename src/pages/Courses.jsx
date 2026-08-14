import { useState } from "react";
import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import CourseCard from "../components/CourseCard";
import CourseFilters from "../components/CourseFilters";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import SkeletonCard from "../components/SkeletonCard";
import courseService from "../services/courseService";
import useResourceList from "../hooks/useResourceList";
import { formatCurrencyUSD } from "../utils/format";

const FILTER_GROUPS = [{ title: "Level", options: ["Beginner", "Intermediate", "Advanced"] }];

// Adapts the API's raw shape (category as an object, price as a decimal string) to what
// the shared CourseCard component expects.
const toCardProps = (course) => ({
  ...course,
  category: course.category?.name || "General",
  price: formatCurrencyUSD(course.price),
});

const Courses = () => {
  const { items, meta, params, setParams, loading, error } = useResourceList(courseService, { limit: 6 });
  const [activeFilters, setActiveFilters] = useState({});

  const handleSearch = (value) => setParams((p) => ({ ...p, search: value, page: 1 }));
  const handlePageChange = (page) => setParams((p) => ({ ...p, page }));

  // Level filtering happens client-side over the current page's results since it's the
  // only facet the backend course list doesn't already support via `search`.
  const handleFilterChange = (groupTitle, option) => {
    setActiveFilters((prev) => {
      const current = prev[groupTitle] || [];
      const next = current.includes(option) ? current.filter((o) => o !== option) : [...current, option];
      return { ...prev, [groupTitle]: next };
    });
  };

  const visibleCourses = items.filter((c) => {
    const levelFilters = activeFilters.Level || [];
    return !levelFilters.length || levelFilters.includes(c.level);
  });

  return (
    <>
      <Helmet><title>Courses | American FutureTech</title></Helmet>
      <PageHeader title="Explore Our Courses" subtitle="Career-focused programs across web, data, cloud, security and design." breadcrumbItems={[{ label: "Courses" }]} />

      <section className="container-page grid grid-cols-1 gap-8 py-12 lg:grid-cols-[280px_1fr]">
        <CourseFilters filters={FILTER_GROUPS} activeFilters={activeFilters} onChange={handleFilterChange} />

        <div>
          <div className="mb-6 max-w-md">
            <SearchBar value={params.search} onChange={handleSearch} placeholder="Search courses..." />
          </div>

          {error && <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : visibleCourses.map((course) => <CourseCard key={course.id} course={toCardProps(course)} />)}
          </div>

          {!loading && !error && visibleCourses.length === 0 && (
            <p className="mt-10 text-center text-slate-500">No courses match your filters.</p>
          )}

          <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
        </div>
      </section>
    </>
  );
};

export default Courses;
