import { useEffect, useState } from "react";

/**
 * Wraps a createResourceService.getById() call with loading/error state.
 * Used by detail pages (CourseDetails, JobDetails, BlogDetails).
 *
 * @param {{ getById: (id: string) => Promise }} service
 * @param {string | number} id
 */
export const useResourceItem = (service, id) => {
  const [item, setItem] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    setStatus("loading");
    setError(null);

    service
      .getById(id)
      .then(({ data }) => {
        if (!cancelled) {
          setItem(data.data);
          setStatus("success");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || "Couldn't load this content item. Please try again.");
          setStatus("error");
        }
      });

    return () => { cancelled = true; };
  }, [service, id]);

  return { item, loading: status === "loading", error, status };
};

export default useResourceItem;
