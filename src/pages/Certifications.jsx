import { Helmet } from "react-helmet-async";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import PageHeader from "../components/PageHeader";
import CTA from "../components/CTA";
import courseService from "../services/courseService";
import useResourceList from "../hooks/useResourceList";

const Certifications = () => {
  const { items, loading, error } = useResourceList(courseService, { limit: 12 });

  return (
    <>
      <Helmet><title>Certifications | American Tech Global</title></Helmet>
      <PageHeader title="Certifications" subtitle="Every program ends with an industry-recognized certificate." breadcrumbItems={[{ label: "Certifications" }]} />

      <section className="container-page py-16">
        {error && <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}
        {loading ? (
          <p className="text-slate-500">Loading certifications...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((course) => (
              <div key={course.id} className="card p-6">
                <HiOutlineBadgeCheck className="h-10 w-10 text-primary-600" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{course.title} Certificate</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Awarded on successful completion of the {(course.duration || "").toLowerCase()} {(course.category?.name || "").toLowerCase()} program.
                </p>
              </div>
            ))}
            {items.length === 0 && <p className="col-span-full text-center text-slate-500">No published courses yet.</p>}
          </div>
        )}
      </section>

      <CTA />
    </>
  );
};

export default Certifications;
