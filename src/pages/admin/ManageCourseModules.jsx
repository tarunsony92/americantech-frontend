import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import courseModuleService from "../../services/courseModuleService";
import courseService from "../../services/courseService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "courseId", label: "Course ID" },
  { key: "order", label: "Order" },
];

const ManageCourseModules = () => {
  const [courseOptions, setCourseOptions] = useState([]);

  useEffect(() => {
    courseService
      .list({ page: 1, limit: 1000 })
      .then(({ data }) => {
        const items = data.data?.items || data.items || [];
        setCourseOptions(items.map((c) => ({ value: c.id, label: c.title })));
      })
      .catch(() => setCourseOptions([]));
  }, []);

  const fields = [
    { key: "courseId", label: "Course", type: "select", options: courseOptions, required: true },
    { key: "title", label: "Title", required: true },
    { key: "order", label: "Order", type: "number", required: true },
  ];

  return (
    <>
      <Helmet><title>Manage Course Modules | Admin</title></Helmet>
      <ResourceManager title="Course Modules" service={courseModuleService} columns={COLUMNS} fields={fields} />
    </>
  );
};

export default ManageCourseModules;