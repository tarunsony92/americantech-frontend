import { Helmet } from "react-helmet-async";
import { eventService } from "../../services/contentService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "date", label: "Date" },
  { key: "location", label: "Location" },
];

const FIELDS = [
  { key: "title", label: "Title", required: true },
  { key: "description", label: "Description", type: "textarea" },
  { key: "date", label: "Date", type: "date", required: true },
  { key: "location", label: "Location", required: true },
  { key: "image", label: "Image URL" },
];

const ManageEvents = () => (
  <>
    <Helmet><title>Manage Events | Admin</title></Helmet>
    <ResourceManager title="Events" service={eventService} columns={COLUMNS} fields={FIELDS} />
  </>
);

export default ManageEvents;
