import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import { galleryService } from "../services/contentService";
import useResourceList from "../hooks/useResourceList";

const Gallery = () => {
  const { items, loading, error } = useResourceList(galleryService, { limit: 24 });

  return (
    <>
      <Helmet><title>Gallery | American FutureTech</title></Helmet>
      <PageHeader title="Gallery" subtitle="Moments from our campus, events, and graduations." breadcrumbItems={[{ label: "Gallery" }]} />

      <section className="container-page py-16">
        {error && <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}
        {loading ? (
          <p className="text-slate-500">Loading gallery...</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((img) => (
              <div key={img.id} className="aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
                <img src={img.image} alt={img.title || ""} loading="lazy" className="h-full w-full object-cover transition-transform hover:scale-105" />
              </div>
            ))}
            {items.length === 0 && <p className="col-span-full text-center text-slate-500">No photos uploaded yet.</p>}
          </div>
        )}
      </section>
    </>
  );
};

export default Gallery;
