import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import batchService from "../../services/batchService";
import courseService from "../../services/courseService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "name", label: "Batch Name" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "status", label: "Status" },
];

const ManageBatches = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    courseService
      .list({ page: 1, limit: 1000 })
      .then(({ data }) => {
        const items = data.data?.items || data.items || [];
        setCourses(items);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const fields = [
    { key: "name", label: "Batch Name", required: true },
    { key: "startDate", label: "Start Date", type: "date" },
    { key: "endDate", label: "End Date", type: "date" },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["upcoming", "ongoing", "completed"],
      required: true,
    },
  ];

  if (selectedCourse) {
    // Wrap the service so every list/create call is scoped to this course,
    // regardless of what ResourceManager passes through.
    const scopedBatchService = {
      ...batchService,
      list: (params = {}) =>
        batchService.list({ ...params, courseId: selectedCourse.id }),
      create: (payload) =>
        batchService.create({ ...payload, courseId: selectedCourse.id }),
    };

    return (
      <>
        <Helmet>
          <title>{selectedCourse.title} - Batches | Admin</title>
        </Helmet>

        <button
          onClick={() => setSelectedCourse(null)}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
        >
          ← Back to Courses
        </button>

        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Batches — {selectedCourse.title}
        </h2>

        <ResourceManager
          title="Batches"
          service={scopedBatchService}
          columns={COLUMNS}
          fields={fields}
        />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Batches | Admin</title>
      </Helmet>

      <h2 className="mb-4 text-lg font-bold text-slate-800">
        Select a Course
      </h2>

      {loading ? (
        <p className="text-sm text-slate-500">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-slate-500">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
            >
              <h3 className="font-semibold text-slate-800 line-clamp-2">
                {course.title}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Course ID: {course.id}
              </p>
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default ManageBatches;