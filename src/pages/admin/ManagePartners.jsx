import { Helmet } from "react-helmet-async";
import { hiringPartnerService } from "../../services/contentService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "name", label: "Partner Name" },
  { key: "website", label: "Website" },
];

const FIELDS = [
  { key: "name", label: "Partner Name", required: true },
  { key: "logo", label: "Logo URL" },
  { key: "website", label: "Website" },
  { key: "isActive", label: "Active", type: "checkbox" },
];

const ManagePartners = () => (
  <>
    <Helmet><title>Manage Hiring Partners | Admin</title></Helmet>
    <ResourceManager title="Hiring Partners" service={hiringPartnerService} columns={COLUMNS} fields={FIELDS} />
  </>
);

export default ManagePartners;
