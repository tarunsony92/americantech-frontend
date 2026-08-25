import axiosInstance from "../api/axiosInstance";
import { createResourceService } from "./createResourceService";

export const courseService = createResourceService("courses");
export const courseCategoryService = createResourceService("course-categories");

// Full curriculum (modules + lessons/videos) for the "learn" page.
courseService.getContent = (id) => axiosInstance.get(`/courses/${id}/content`);

export default courseService;