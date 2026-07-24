import { Helmet } from "react-helmet-async";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";
import PageHeader from "../components/PageHeader";
import { eventService } from "../services/contentService";
import useResourceList from "../hooks/useResourceList";
import { formatDate } from "../utils/format";

const Events = () => {
  const { items, loading, error } = useResourceList(eventService, { limit: 12 });

  return (
    <>
      <Helmet><title>Events | American Tech Global</title></Helmet>
      <PageHeader title="Events" subtitle="Career fairs, webinars, and workshops." breadcrumbItems={[{ label: "Events" }]} />

      <section className="container-page py-16">
        {error && <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}
        {loading ? (
          <p className="text-slate-500">Loading events...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {items.map((e) => (
              <div key={e.id} className="card overflow-hidden sm:flex">
                {e.image && <img src={e.image} alt={e.title} className="h-48 w-full object-cover sm:h-auto sm:w-48" />}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{e.title}</h3>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300"><HiOutlineCalendar className="h-4 w-4" /> {formatDate(e.date)}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300"><HiOutlineLocationMarker className="h-4 w-4" /> {e.location}</p>
                  <button className="btn-outline mt-4">Register Interest</button>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="col-span-full text-center text-slate-500">No upcoming events.</p>}
          </div>
        )}
      </section>
    </>
  );
};

export default Events;
