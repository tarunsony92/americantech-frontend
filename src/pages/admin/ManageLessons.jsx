import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import lessonService from "../../services/lessonService";
import courseModuleService from "../../services/courseModuleService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "moduleId", label: "Module ID" },
  { key: "videoUrl", label: "Video URL" },
  { key: "order", label: "Order" },
];

const ManageLessons = () => {
  const [moduleOptions, setModuleOptions] = useState([]);

  useEffect(() => {
    courseModuleService
      .list({ page: 1, limit: 1000 })
      .then(({ data }) => {
        const items = data.data?.items || data.items || [];
        setModuleOptions(items.map((m) => ({ value: m.id, label: m.title })));
      })
      .catch(() => setModuleOptions([]));
  }, []);

  const fields = [
    { key: "moduleId", label: "Module", type: "select", options: moduleOptions, required: true },
    { key: "title", label: "Title", required: true },
    { key: "videoUrl", label: "Video URL (link)" },
    { key: "content", label: "Notes / Content", type: "textarea" },
    { key: "order", label: "Order", type: "number", required: true },
  ];

  return (
    <>
      <Helmet><title>Manage Lessons | Admin</title></Helmet>
      <ResourceManager title="Lessons" service={lessonService} columns={COLUMNS} fields={fields} />
    </>
  );
};

export default ManageLessons;