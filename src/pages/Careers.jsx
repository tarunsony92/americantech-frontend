import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import JobCard from "../components/JobCard";
import JobFilters from "../components/JobFilters";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import jobService from "../services/jobService";
import useResourceList from "../hooks/useResourceList";
import { timeAgo } from "../utils/format";

const FILTER_GROUPS = [{ title: "Job Type", options: ["Full-time", "Internship", "Contract", "Remote"] }];

const toCardProps = (job) => ({
  ...job,
  company: job.company?.name || "Confidential",
  postedAt: timeAgo(job.createdAt),
});

const Careers = () => {
  const { items, meta, params, setParams, loading, error } = useResourceList(jobService, { limit: 6 });

  const handleSearch = (value) => setParams((p) => ({ ...p, search: value, page: 1 }));
  const handlePageChange = (page) => setParams((p) => ({ ...p, page }));
  const handleFilterChange = (groupTitle, option) => {
    if (groupTitle !== "Job Type") return;
    setParams((p) => ({ ...p, page: 1, type: p.type === option ? undefined : option }));
  };

  return (
    <>
      <Helmet><title>Career Opportunities | American Tech Global</title></Helmet>
      <PageHeader title="Career Opportunities" subtitle="Open roles from our network of hiring partners." breadcrumbItems={[{ label: "Careers" }]} />

      <section className="container-page grid grid-cols-1 gap-8 py-12 lg:grid-cols-[280px_1fr]">
        <JobFilters
          filters={FILTER_GROUPS}
          activeFilters={{ "Job Type": params.type ? [params.type] : [] }}
          onChange={handleFilterChange}
        />

        <div>
          <div className="mb-6 max-w-md">
            <SearchBar value={params.search} onChange={handleSearch} placeholder="Search jobs or companies..." />
          </div>

          {error && <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}

          {loading ? (
            <p className="text-slate-500">Loading jobs...</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {items.map((job) => <JobCard key={job.id} job={toCardProps(job)} />)}
            </div>
          )}

          {!loading && !error && items.length === 0 && <p className="mt-10 text-center text-slate-500">No openings match your filters.</p>}

          <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
        </div>
      </section>
    </>
  );
};

export default Careers;
