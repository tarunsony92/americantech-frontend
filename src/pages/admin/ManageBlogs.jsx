import { Helmet } from "react-helmet-async";
import blogService from "../../services/blogService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "author", label: "Author" },
];

const FIELDS = [
  { key: "title", label: "Title", required: true },
  { key: "slug", label: "Slug", required: true },
  { key: "categoryId", label: "Category ID", type: "number", required: true },
  { key: "authorId", label: "Author (User) ID", type: "number" },
  { key: "excerpt", label: "Excerpt", type: "textarea" },
  { key: "content", label: "Content", type: "textarea", required: true },
  { key: "image", label: "Image URL" },
  { key: "isPublished", label: "Published", type: "checkbox" },
];

const ManageBlogs = () => (
  <>
    <Helmet><title>Manage Blogs | Admin</title></Helmet>
    <ResourceManager title="Blogs" service={blogService} columns={COLUMNS} fields={FIELDS} />
  </>
);

export default ManageBlogs;
