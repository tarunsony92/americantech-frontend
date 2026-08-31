import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import courseModuleService from "../../services/courseModuleService";
import batchService from "../../services/batchService";
import courseService from "../../services/courseService";
import ResourceManager from "../../components/admin/ResourceManager";

const COLUMNS = [
  { key: "title", label: "Title" },
  { key: "order", label: "Order" },
];

const ManageCourseModules = () => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  useEffect(() => {
    courseService
      .list({ page: 1, limit: 1000 })
      .then(({ data }) => {
        const items = data.data?.items || data.items || [];
        setCourses(items);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoadingCourses(false));
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;
    setLoadingBatches(true);
    batchService
      .list({ page: 1, limit: 1000, courseId: selectedCourse.id })
      .then(({ data }) => {
        const items = data.data?.items || data.items || [];
        setBatches(items);
      })
      .catch(() => setBatches([]))
      .finally(() => setLoadingBatches(false));
  }, [selectedCourse]);

  const fields = [
    { key: "title", label: "Title", required: true },
    { key: "order", label: "Order", type: "number", required: true },
  ];

  // ===== Step 3: Modules of selected batch =====
  if (selectedBatch) {
    // Wrap the service so every list/create call is scoped to this batch,
    // regardless of what ResourceManager passes through.
    const scopedModuleService = {
      ...courseModuleService,
      list: (params = {}) =>
        courseModuleService.list({ ...params, batchId: selectedBatch.id }),
      create: (payload) =>
        courseModuleService.create({
          ...payload,
          batchId: selectedBatch.id,
          courseId: selectedCourse.id,
        }),
    };

    return (
      <>
        <Helmet>
          <title>{selectedBatch.name} - Modules | Admin</title>
        </Helmet>

        <button
          onClick={() => setSelectedBatch(null)}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
        >
          ← Back to Batches
        </button>

        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Modules — {selectedCourse.title} / {selectedBatch.name}
        </h2>

        <ResourceManager
          title="Course Modules"
          service={scopedModuleService}
          columns={COLUMNS}
          fields={fields}
        />
      </>
    );
  }

  // ===== Step 2: Batches of selected course =====
  if (selectedCourse) {
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

        {loadingBatches ? (
          <p className="text-sm text-slate-500">Loading batches...</p>
        ) : batches.length === 0 ? (
          <p className="text-sm text-slate-500">
            No batches found for this course. Create a batch first.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {batches.map((batch) => (
              <button
                key={batch.id}
                onClick={() => setSelectedBatch(batch)}
                className="text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
              >
                <h3 className="font-semibold text-slate-800 line-clamp-2">
                  {batch.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Status: {batch.status}
                </p>
              </button>
            ))}
          </div>
        )}
      </>
    );
  }

  // ===== Step 1: Course selection =====
  return (
    <>
      <Helmet>
        <title>Manage Course Modules | Admin</title>
      </Helmet>

      <h2 className="mb-4 text-lg font-bold text-slate-800">
        Select a Course
      </h2>

      {loadingCourses ? (
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

export default ManageCourseModules;