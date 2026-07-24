import axiosInstance from "../api/axiosInstance";
import { createResourceService } from "./createResourceService";

// Standard admin CRUD for certificates.
export const certificateService = createResourceService("certificates");

// The logged-in student's own certificates — used by the dashboard's My Certificates page.
certificateService.listMine = () => axiosInstance.get("/certificates/mine");

export default certificateService;
