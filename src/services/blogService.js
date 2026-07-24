import { createResourceService } from "./createResourceService";

export const blogService = createResourceService("blogs");
export const blogCategoryService = createResourceService("blog-categories");
export default blogService;
