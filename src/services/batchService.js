import axiosInstance from "../api/axiosInstance";
import createResourceService from "./createResourceService";

const baseService = createResourceService("batches");

/**
 * Batch service — standard CRUD (list/getById/create/update/remove) plus
 * getContent for the batch-wise curriculum view (modules + lessons).
 */
const batchService = {
  ...baseService,
  getContent: (id) => axiosInstance.get(`/batches/${id}/content`),
};

export default batchService;