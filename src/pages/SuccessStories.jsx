import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import CTA from "../components/CTA";
import { successStoryService } from "../services/contentService";
import useResourceList from "../hooks/useResourceList";

const SuccessStories = () => {
  const { items, loading, error } = useResourceList(successStoryService, { limit: 12 });

  return (
    <>
      <Helmet><title>Success Stories | American Tech Global</title></Helmet>
      <PageHeader title="Success Stories" subtitle="Real graduates, real career transitions." breadcrumbItems={[{ label: "Success Stories" }]} />

      <section className="container-page py-16">
        {error && <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}
        {loading ? (
          <p className="text-slate-500">Loading stories...</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {items.map((s) => (
              <div key={s.id} className="card overflow-hidden">
                {s.image && <img src={s.image} alt={s.name} className="h-56 w-full object-cover" />}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                  <p className="mt-1 text-sm font-medium text-primary-600">{s.name}</p>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{s.summary}</p>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="col-span-full text-center text-slate-500">No success stories published yet.</p>}
          </div>
        )}
      </section>

      <CTA />
    </>
  );
};

export default SuccessStories;
