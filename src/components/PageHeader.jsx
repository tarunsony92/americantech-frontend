import Breadcrumb from "./Breadcrumb";

const PageHeader = ({ title, subtitle, breadcrumbItems = [] }) => (
  <div className="bg-slate-50 py-14 dark:bg-slate-900">
    <div className="container-page">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">{subtitle}</p>}
    </div>
  </div>
);

export default PageHeader;
