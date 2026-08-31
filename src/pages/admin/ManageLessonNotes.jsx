import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import lessonService from "../../services/lessonService";
import courseModuleService from "../../services/courseModuleService";
import batchService from "../../services/batchService";
import courseService from "../../services/courseService";
import LessonNotesManager from "../../components/admin/LessonNotesManager";

const ManageLessonNotes = () => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [batches, setBatches] = useState([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  const [modules, setModules] = useState([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const [lessons, setLessons] = useState([]);
  const [loadingLessons, setLoadingLessons] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);

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

  useEffect(() => {
    if (!selectedBatch) return;
    setLoadingModules(true);
    courseModuleService
      .list({ page: 1, limit: 1000, batchId: selectedBatch.id })
      .then(({ data }) => {
        const items = data.data?.items || data.items || [];
        setModules(items);
      })
      .catch(() => setModules([]))
      .finally(() => setLoadingModules(false));
  }, [selectedBatch]);

  useEffect(() => {
    if (!selectedModule) return;
    setLoadingLessons(true);
    lessonService
      .list({ page: 1, limit: 1000, moduleId: selectedModule.id })
      .then(({ data }) => {
        const items = data.data?.items || data.items || [];
        setLessons(items);
      })
      .catch(() => setLessons([]))
      .finally(() => setLoadingLessons(false));
  }, [selectedModule]);

  // ===== Step 5: Notes of selected lesson =====
  if (selectedLesson) {
    return (
      <>
        <Helmet>
          <title>{selectedLesson.title} - Notes | Admin</title>
        </Helmet>

        <button
          onClick={() => setSelectedLesson(null)}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
        >
          ← Back to Lessons
        </button>

        <h2 className="mb-1 text-lg font-bold text-slate-800">
          {selectedLesson.title}
        </h2>
        <p className="mb-6 text-xs text-slate-500">
          {selectedCourse.title} / {selectedBatch.name} / {selectedModule.title}
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <LessonNotesManager lessonId={selectedLesson.id} />
        </div>
      </>
    );
  }

  // ===== Step 4: Lessons of selected module =====
  if (selectedModule) {
    return (
      <>
        <Helmet>
          <title>{selectedModule.title} - Lessons | Admin</title>
        </Helmet>

        <button
          onClick={() => setSelectedModule(null)}
          className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
        >
          ← Back to Modules
        </button>

        <h2 className="mb-4 text-lg font-bold text-slate-800">
          Lessons — {selectedCourse.title} / {selectedBatch.name} / {selectedModule.title}
        </h2>

        {loadingLessons ? (
          <p className="text-sm text-slate-500">Loading lessons...</p>
        ) : lessons.length === 0 ? (
          <p className="text-sm text-slate-500">
            No lessons found for this module.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
                className="text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
              >
                <h3 className="font-semibold text-slate-800 line-clamp-2">
                  {lesson.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Order: {lesson.order}
                </p>
              </button>
            ))}
          </div>
        )}
      </>
    );
  }

  // ===== Step 3: Modules of selected batch =====
  if (selectedBatch) {
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

        {loadingModules ? (
          <p className="text-sm text-slate-500">Loading modules...</p>
        ) : modules.length === 0 ? (
          <p className="text-sm text-slate-500">
            No modules found for this batch.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setSelectedModule(module)}
                className="text-left rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
              >
                <h3 className="font-semibold text-slate-800 line-clamp-2">
                  {module.title}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Order: {module.order}
                </p>
              </button>
            ))}
          </div>
        )}
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
          <p className="text-sm text-slate-500">No batches found for this course.</p>
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
        <title>Manage Lesson Notes | Admin</title>
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

export default ManageLessonNotes;