import axiosInstance from "../api/axiosInstance";

/**
 * Factory that builds a standard CRUD service for a REST resource.
 * Every backend module exposes: list (with pagination/search/sort/filter),
 * getById, create, update, remove.
 */
export const createResourceService = (resourcePath) => ({
  list: (params = {}) => axiosInstance.get(`/${resourcePath}`, { params }),
  getById: (id) => axiosInstance.get(`/${resourcePath}/${id}`),
  create: (payload) => axiosInstance.post(`/${resourcePath}`, payload),
  update: (id, payload) => axiosInstance.put(`/${resourcePath}/${id}`, payload),
  remove: (id) => axiosInstance.delete(`/${resourcePath}/${id}`),
});

export default createResourceService;
