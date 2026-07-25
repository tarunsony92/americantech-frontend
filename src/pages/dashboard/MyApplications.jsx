import { Helmet } from "react-helmet-async";
import { JOBS } from "../../utils/mockData";

const STATUS_STYLES = {
  Applied: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  Shortlisted: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Selected: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

const APPLICATIONS = JOBS.slice(0, 3).map((job, i) => ({
  ...job,
  status: ["Applied", "Shortlisted", "Selected"][i],
}));

const MyApplications = () => (
  <>
    <Helmet><title>My Applications | American FutureTech</title></Helmet>
    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Applications</h1>
    <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 dark:bg-slate-900">
          <tr>
            <th className="px-4 py-3">Job Title</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {APPLICATIONS.map((a) => (
            <tr key={a.id} className="border-t border-slate-200 dark:border-slate-800">
              <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{a.title}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{a.company}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[a.status]}`}>{a.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

export default MyApplications;
