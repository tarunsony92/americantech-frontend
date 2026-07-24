import { Helmet } from "react-helmet-async";
import { faqService } from "../../services/contentService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "question", label: "Question" },
  { key: "answer", label: "Answer" },
];

const FIELDS = [
  { key: "question", label: "Question", required: true },
  { key: "answer", label: "Answer", type: "textarea", required: true },
  { key: "category", label: "Category" },
  { key: "order", label: "Display Order", type: "number" },
];

const ManageFaq = () => (
  <>
    <Helmet><title>Manage FAQ | Admin</title></Helmet>
    <ResourceManager title="FAQs" service={faqService} columns={COLUMNS} fields={FIELDS} />
  </>
);

export default ManageFaq;
