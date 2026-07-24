import axiosInstance from "../api/axiosInstance";
import { createResourceService } from "./createResourceService";

// Standard admin CRUD for enrollments.
export const enrollmentService = createResourceService("enrollments");

// Self-service enroll — used by "Enroll Now" on the course details page.
enrollmentService.enrollSelf = (courseId) => axiosInstance.post("/enrollments/enroll", { courseId });

// The logged-in student's own enrollments — used by the dashboard's My Courses page.
enrollmentService.listMine = () => axiosInstance.get("/enrollments/mine");

export default enrollmentService;
