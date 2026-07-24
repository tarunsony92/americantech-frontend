import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiOutlineLocationMarker, HiOutlineBriefcase, HiOutlineClock, HiCheckCircle } from "react-icons/hi";
import PageHeader from "../components/PageHeader";
import jobService from "../services/jobService";
import useResourceItem from "../hooks/useResourceItem";
import { timeAgo } from "../utils/format";

const DEFAULT_RESPONSIBILITIES = [
  "Collaborate with cross-functional teams to ship features",
  "Write clean, tested, maintainable code",
  "Participate in code reviews and design discussions",
];
const DEFAULT_REQUIREMENTS = [
  "Solid understanding of core programming fundamentals",
  "Familiarity with modern development tooling and version control",
  "Strong communication and problem-solving skills",
];

const JobDetails = () => {
  const { id } = useParams();
  const { item: job, loading, error } = useResourceItem(jobService, id);

  if (loading) return <div className="container-page py-24 text-center text-slate-500">Loading job...</div>;
  if (error || !job) return <div className="container-page py-24 text-center text-red-500">{error || "Job not found."}</div>;

  const responsibilities = job.description ? job.description.split("\n").filter(Boolean) : DEFAULT_RESPONSIBILITIES;
  const requirements = job.requirements ? job.requirements.split("\n").filter(Boolean) : DEFAULT_REQUIREMENTS;

  return (
    <>
      <Helmet><title>{job.title} | American Tech Global</title></Helmet>
      <PageHeader
        title={job.title}
        subtitle={job.company?.name}
        breadcrumbItems={[{ label: "Careers", to: "/careers" }, { label: job.title }]}
      />

      <section className="container-page grid grid-cols-1 gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1"><HiOutlineLocationMarker className="h-4 w-4" /> {job.location}</span>
            <span className="flex items-center gap-1"><HiOutlineBriefcase className="h-4 w-4" /> {job.type}</span>
            <span className="flex items-center gap-1"><HiOutlineClock className="h-4 w-4" /> Posted {timeAgo(job.createdAt)}</span>
          </div>

          <h2 className="section-title mt-8">Responsibilities</h2>
          <ul className="mt-4 space-y-3">
            {responsibilities.map((r) => (
              <li key={r} className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <HiCheckCircle className="h-5 w-5 flex-shrink-0 text-primary-600" /> {r}
              </li>
            ))}
          </ul>

          <h2 className="section-title mt-10">Requirements</h2>
          <ul className="mt-4 space-y-3">
            {requirements.map((r) => (
              <li key={r} className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <HiCheckCircle className="h-5 w-5 flex-shrink-0 text-primary-600" /> {r}
              </li>
            ))}
          </ul>
        </div>

        <aside className="card h-fit p-6">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{job.company?.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{job.location}</p>
          <Link to={`/careers/${job.id}/apply`} className="btn-primary mt-5 w-full">Apply Now</Link>
        </aside>
      </section>
    </>
  );
};

export default JobDetails;
