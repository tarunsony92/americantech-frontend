
// services/courseJobService.js

import api from "../api/axiosInstance";

const courseJobService = {
  // GET /api/v1/coursejobs
  list: async (params = {}) => {
    const res = await api.get("/coursejobs", {
      params,
    });

    return {
      data: {
        data: {
          items: res.data.data || [],
          total: res.data.meta?.total || 0,
        },
        meta: res.data.meta || {
          page: 1,
          limit: params.limit || 9,
          total: 0,
          totalPages: 0,
        },
      },
    };
  },

  // GET /api/v1/coursejobs/:id
  getById: async (id) => {
    if (!id) {
      throw new Error("Job ID is required.");
    }

    const res = await api.get(`/coursejobs/${id}`);

    return res.data.data;
  },

  // POST /api/v1/coursejobs
  create: async (payload) => {
    const res = await api.post("/coursejobs", payload);

    return res.data.data;
  },

  // PUT /api/v1/coursejobs/:id
  update: async (id, payload) => {
    if (!id) {
      throw new Error("Job ID is required.");
    }

    const res = await api.put(`/coursejobs/${id}`, payload);

    return res.data.data;
  },

  // DELETE /api/v1/coursejobs/:id
  remove: async (id) => {
    if (!id) {
      throw new Error("Job ID is required.");
    }

    const res = await api.delete(`/coursejobs/${id}`);

    return res.data;
  },
};

export default courseJobService;

