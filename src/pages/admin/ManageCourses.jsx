import { Helmet } from "react-helmet-async";
import courseService from "../../services/courseService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "level", label: "Level" },
  { key: "price", label: "Price" },
];

const FIELDS = [
  { key: "title", label: "Title", required: true },
  { key: "slug", label: "Slug (url-friendly, e.g. full-stack-dev)", required: true },
  { key: "categoryId", label: "Category ID", type: "number", required: true },
  { key: "instructorId", label: "Registration Fee", type: "number" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "duration", label: "Duration (e.g. 16 Weeks)" },
  { key: "level", label: "Level", type: "select", options: ["Beginner", "Intermediate", "Advanced"], required: true },
  { key: "price", label: "Price", type: "number", required: true },
  { key: "rating", label: "Rating", type: "number" },
  { key: "image", label: "Image URL" },
  { key: "isPublished", label: "Published", type: "checkbox" },
];

const ManageCourses = () => (
  <>
    <Helmet><title>Manage Courses | Admin</title></Helmet>
    <ResourceManager title="Courses" service={courseService} columns={COLUMNS} fields={FIELDS} />
  </>
);

export default ManageCourses;
