import { useCallback, useEffect, useState } from "react";

/**
 * Wraps a createResourceService.list() call with loading/error state, pagination,
 * search and simple filters. Used by every public listing page (Courses, Careers, Blog, ...).
 *
 * @param {{ list: (params: object) => Promise }} service
 * @param {object} [initialParams] - e.g. { limit: 6 }
 */
export const useResourceList = (service, initialParams = {}) => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [params, setParams] = useState({ page: 1, limit: 9, search: "", ...initialParams });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const { data } = await service.list(params);
      setItems(data.data?.items || []);
      setMeta({
        page: data.meta?.page || 1,
        totalPages: data.meta?.totalPages || 1,
        total: data.data?.total || 0,
      });
      setStatus("success");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load this content List. Please try again.");
      setStatus("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, JSON.stringify(params)]);

  useEffect(() => { fetchList(); }, [fetchList]);

  return {
    items,
    meta,
    params,
    setParams,
    status,
    error,
    loading: status === "loading",
    refetch: fetchList,
  };
};

export default useResourceList;
