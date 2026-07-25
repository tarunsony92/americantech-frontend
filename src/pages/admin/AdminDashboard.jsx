import { Helmet } from "react-helmet-async";
import { HiOutlineUsers, HiOutlineBookOpen, HiOutlineBriefcase, HiOutlineNewspaper } from "react-icons/hi";

const STATS = [
  { label: "Total Users", value: 1240, icon: HiOutlineUsers },
  { label: "Active Courses", value: 18, icon: HiOutlineBookOpen },
  { label: "Open Jobs", value: 32, icon: HiOutlineBriefcase },
  { label: "Blog Posts", value: 56, icon: HiOutlineNewspaper },
];

const AdminDashboard = () => (
  <>
    <Helmet><title>Admin Dashboard | American FutureTech</title></Helmet>
    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="card flex items-center gap-4 p-5">
          <div className="rounded-lg bg-primary-50 p-3 text-primary-600 dark:bg-primary-950">
            <s.icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value.toLocaleString()}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default AdminDashboard;
