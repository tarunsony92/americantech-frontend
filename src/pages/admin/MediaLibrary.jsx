import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { HiOutlineUpload, HiOutlineTrash } from "react-icons/hi";
import { createResourceService } from "../../services/createResourceService";

const mediaService = createResourceService("media-library");

const MediaLibrary = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    mediaService.list().then(({ data }) => setItems(data.items || data.data || []))
      .catch((err) => setError(err.response?.data?.message || "Couldn't load media library. Is the API running?"));
  }, []);

  return (
    <>
      <Helmet><title>Media Library | Admin</title></Helmet>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Media Library</h1>
        <button className="btn-primary"><HiOutlineUpload className="h-4 w-4" /> Upload</button>
      </div>

      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
        {items.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
            <img src={item.url} alt={item.name} className="h-full w-full object-cover" />
            <button className="absolute right-1 top-1 hidden rounded bg-white/90 p-1 text-red-500 group-hover:block"><HiOutlineTrash className="h-4 w-4" /></button>
          </div>
        ))}
        {items.length === 0 && !error && <p className="col-span-full text-sm text-slate-500">No media uploaded yet.</p>}
      </div>
    </>
  );
};

export default MediaLibrary;
