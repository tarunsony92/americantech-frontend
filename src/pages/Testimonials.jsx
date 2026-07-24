import { Helmet } from "react-helmet-async";
import { HiStar } from "react-icons/hi";
import PageHeader from "../components/PageHeader";
import { testimonialService } from "../services/contentService";
import useResourceList from "../hooks/useResourceList";

const Testimonials = () => {
  const { items, loading, error } = useResourceList(testimonialService, { limit: 12 });

  return (
    <>
      <Helmet><title>Testimonials | American Tech Global</title></Helmet>
      <PageHeader title="Testimonials" subtitle="What our students say about their experience." breadcrumbItems={[{ label: "Testimonials" }]} />

      <section className="container-page py-16">
        {error && <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}
        {loading ? (
          <p className="text-slate-500">Loading testimonials...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((t) => (
              <div key={t.id} className="card p-6">
                <div className="flex gap-1">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => <HiStar key={i} className="h-4 w-4 text-amber-400" />)}
                </div>
                <p className="mt-4 text-slate-600 dark:text-slate-300">"{t.quote}"</p>
                <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            ))}
            {items.length === 0 && <p className="col-span-full text-center text-slate-500">No testimonials yet.</p>}
          </div>
        )}
      </section>
    </>
  );
};

export default Testimonials;
