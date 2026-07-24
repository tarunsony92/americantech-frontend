import { Helmet } from "react-helmet-async";
import { instructorService } from "../../services/contentService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "fullName", label: "Name" },
  { key: "expertise", label: "Expertise" },
  { key: "email", label: "Email" },
];

const FIELDS = [
  { key: "fullName", label: "Full Name", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "expertise", label: "Expertise" },
  { key: "bio", label: "Bio", type: "textarea" },
  { key: "avatar", label: "Avatar URL" },
];

const ManageInstructors = () => (
  <>
    <Helmet><title>Manage Instructors | Admin</title></Helmet>
    <ResourceManager title="Instructors" service={instructorService} columns={COLUMNS} fields={FIELDS} />
  </>
);

export default ManageInstructors;
