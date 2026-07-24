import { createResourceService } from "./createResourceService";

export const courseService = createResourceService("courses");
export const courseCategoryService = createResourceService("course-categories");
export default courseService;
