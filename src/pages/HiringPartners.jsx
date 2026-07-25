import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import CTA from "../components/CTA";
import { hiringPartnerService } from "../services/contentService";
import useResourceList from "../hooks/useResourceList";

const HiringPartners = () => {
  const { items, loading, error } = useResourceList(hiringPartnerService, { limit: 24 });

  return (
    <>
      <Helmet><title>Hiring Partners | American FutureTech</title></Helmet>
      <PageHeader title="Hiring Partners" subtitle="Companies that trust our graduates." breadcrumbItems={[{ label: "Hiring Partners" }]} />

      <section className="container-page py-16">
        {error && <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}
        {loading ? (
          <p className="text-slate-500">Loading partners...</p>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((p) => (
              <div key={p.id} className="card flex h-24 items-center justify-center p-4 text-center font-semibold text-slate-700 dark:text-slate-200">
                {p.logo ? <img src={p.logo} alt={p.name} className="max-h-12" /> : p.name}
              </div>
            ))}
            {items.length === 0 && <p className="col-span-full text-center text-slate-500">No partners listed yet.</p>}
          </div>
        )}
      </section>

      <CTA title="Want to hire our graduates?" subtitle="Partner with us to access job-ready tech talent." ctaLabel="Contact Us" ctaTo="/contact" />
    </>
  );
};

export default HiringPartners;
