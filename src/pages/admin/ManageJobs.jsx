import { Helmet } from "react-helmet-async";
import jobService from "../../services/jobService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "company", label: "Company" },
  { key: "location", label: "Location" },
  { key: "type", label: "Type" },
];

const FIELDS = [
  { key: "title", label: "Title", required: true },
  { key: "companyId", label: "Hiring Partner ID", type: "number", required: true },
  { key: "categoryId", label: "Career Category ID", type: "number" },
  { key: "location", label: "Location", required: true },
  { key: "type", label: "Type", type: "select", options: ["Full-time", "Internship", "Contract", "Remote"], required: true },
  { key: "description", label: "Responsibilities (one per line)", type: "textarea" },
  { key: "requirements", label: "Requirements (one per line)", type: "textarea" },
  { key: "isActive", label: "Active", type: "checkbox" },
];

const ManageJobs = () => (
  <>
    <Helmet><title>Manage Jobs | Admin</title></Helmet>
    <ResourceManager title="Jobs" service={jobService} columns={COLUMNS} fields={FIELDS} />
  </>
);

export default ManageJobs;
