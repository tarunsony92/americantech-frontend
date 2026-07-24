import { Helmet } from "react-helmet-async";
import { testimonialService } from "../../services/contentService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "name", label: "Name" },
  { key: "role", label: "Role" },
  { key: "rating", label: "Rating" },
];

const FIELDS = [
  { key: "name", label: "Name", required: true },
  { key: "role", label: "Role" },
  { key: "quote", label: "Quote", type: "textarea", required: true },
  { key: "rating", label: "Rating (1-5)", type: "number", required: true },
  { key: "avatar", label: "Avatar URL" },
  { key: "isPublished", label: "Published", type: "checkbox" },
];

const ManageTestimonials = () => (
  <>
    <Helmet><title>Manage Testimonials | Admin</title></Helmet>
    <ResourceManager title="Testimonials" service={testimonialService} columns={COLUMNS} fields={FIELDS} />
  </>
);

export default ManageTestimonials;
