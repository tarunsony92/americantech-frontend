import { createResourceService } from "./createResourceService";

export const jobService = createResourceService("jobs");
export const jobApplicationService = createResourceService("job-applications");
export default jobService;
