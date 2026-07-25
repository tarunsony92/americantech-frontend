import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { HiOutlineBookOpen, HiOutlineBadgeCheck, HiOutlineDocumentText } from "react-icons/hi";

const STATS = [
  { label: "Enrolled Courses", value: 2, icon: HiOutlineBookOpen },
  { label: "Certificates Earned", value: 1, icon: HiOutlineBadgeCheck },
  { label: "Job Applications", value: 4, icon: HiOutlineDocumentText },
];

const Overview = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <Helmet><title>Dashboard | American Tech Global</title></Helmet>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back{user?.fullName ? `, ${user.fullName}` : ""}</h1>
      <p className="mt-1 text-sm text-slate-500">Here's a snapshot of your learning journey.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary-50 p-3 text-primary-600 dark:bg-primary-950">
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Overview;
