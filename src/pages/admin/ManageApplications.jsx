import { Helmet } from "react-helmet-async";
import { jobApplicationService } from "../../services/jobService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "fullName", label: "Applicant" },
  { key: "email", label: "Email" },
  { key: "jobId", label: "Job ID" },
];

const FIELDS = [
  { key: "statusId", label: "Status ID (1=Applied, 2=Shortlisted, 3=Interviewing, 4=Selected, 5=Rejected)", type: "number", required: true },
];

const ManageApplications = () => (
  <>
    <Helmet><title>Manage Applications | Admin</title></Helmet>
    {/* Applications come in via the public Apply form; admin edits are status updates only */}
    <ResourceManager title="Job Applications" service={jobApplicationService} columns={COLUMNS} fields={FIELDS} />
  </>
);

export default ManageApplications;
