import { Helmet } from "react-helmet-async";
import { createResourceService } from "../../services/createResourceService";
import ResourceManager from "../../components/admin/ResourceManager";

const newsletterService = createResourceService("newsletters");

const COLUMNS = [
  { key: "email", label: "Email" },
  { key: "isActive", label: "Active" },
];

const ManageNewsletters = () => (
  <>
    <Helmet><title>Manage Newsletters | Admin</title></Helmet>
    {/* Read-only: subscribers come in via the public newsletter form, admin doesn't add these manually */}
    <ResourceManager title="Newsletter Subscribers" service={newsletterService} columns={COLUMNS} />
  </>
);

export default ManageNewsletters;
