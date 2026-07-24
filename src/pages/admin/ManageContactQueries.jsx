import { Helmet } from "react-helmet-async";
import { createResourceService } from "../../services/createResourceService";
import ResourceManager from "../../components/admin/ResourceManager";

const contactQueryService = createResourceService("contact-queries");

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "subject", label: "Subject" },
];

const ManageContactQueries = () => (
  <>
    <Helmet><title>Manage Contact Queries | Admin</title></Helmet>
    {/* Read-only: queries come in via the public contact form */}
    <ResourceManager title="Contact Queries" service={contactQueryService} columns={COLUMNS} />
  </>
);

export default ManageContactQueries;
