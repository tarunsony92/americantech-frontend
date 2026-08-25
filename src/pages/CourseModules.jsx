import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  HiChevronDown,
  HiChevronRight,
} from "react-icons/hi";
import courseService from "../services/courseService";

const CourseModules = () => {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [openModuleId, setOpenModuleId] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Course ID is missing.");
      setStatus("error");
      return;
    }

    courseService
      .getContent(id)
      .then(({ data }) => {
        const courseData = data.data;

        if (!courseData) {
          throw new Error("Course data not found.");
        }

        setCourse(courseData);

        // First module open by default
        const firstModule = courseData.modules?.[0];

        if (firstModule) {
          setOpenModuleId(firstModule.id);
        }

        setStatus("success");
      })
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Couldn't load course modules."
        );
        setStatus("error");
      });
  }, [id]);

  const toggleModule = (moduleId) => {
    setOpenModuleId((prev) =>
      prev === moduleId ? null : moduleId
    );
  };

  if (status === "loading") {
    return (
      <div className="mt-6">
        <p className="text-slate-500">
          Loading course modules...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="mt-6">
        <Link
          to="/my-courses"
          className="text-sm text-primary-600 hover:underline"
        >
          ← Back to My Courses
        </Link>

        <p className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">
          {error}
        </p>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  const modules = course.modules || [];

  return (
    <>
      <Helmet>
        <title>
          {course.title} Modules | American FutureTech
        </title>
      </Helmet>

      {/* Back to My Courses */}
      <Link
        to="/my-courses"
        className="text-sm text-primary-600 hover:underline"
      >
        ← Back to My Courses
      </Link>

      {/* Course Header */}
      <div className="mt-3">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {course.title}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {modules.length}{" "}
          {modules.length === 1 ? "Module" : "Modules"}
        </p>
      </div>

      {/* Modules */}
      <div className="mt-6 max-w-4xl space-y-4">
        {modules.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-slate-500">
              No modules available for this course.
            </p>
          </div>
        ) : (
          modules.map((module, index) => {
            const isOpen = openModuleId === module.id;
            const lessons = module.lessons || [];

            return (
              <div
                key={module.id}
                className="card overflow-hidden"
              >
                {/* Module Header */}
                <button
                  type="button"
                  onClick={() => toggleModule(module.id)}
                  className="flex w-full items-center justify-between p-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                      Module {index + 1}
                    </p>

                    <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                      {module.title}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {lessons.length}{" "}
                      {lessons.length === 1
                        ? "Lesson"
                        : "Lessons"}
                    </p>
                  </div>

                  {isOpen ? (
                    <HiChevronDown className="ml-4 h-5 w-5 flex-shrink-0 text-slate-400" />
                  ) : (
                    <HiChevronRight className="ml-4 h-5 w-5 flex-shrink-0 text-slate-400" />
                  )}
                </button>

                {/* Lessons */}
                {isOpen && (
                  <div className="border-t border-slate-200 dark:border-slate-800">
                    {lessons.length === 0 ? (
                      <p className="p-5 text-sm text-slate-500">
                        No lessons available in this module.
                      </p>
                    ) : (
                      <div className="divide-y divide-slate-200 dark:divide-slate-800">
                        {lessons.map(
                          (lesson, lessonIndex) => (
                            <Link
                              key={lesson.id}
                              to={`/dashboard/courses/${course.id}/learn?lesson=${lesson.id}`}
                              className="flex items-center gap-3 px-5 py-4 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                              {/* Play Icon */}
                              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-950">
                                <span className="text-xs">
                                  ▶
                                </span>
                              </div>

                              {/* Lesson Info */}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                                  {lessonIndex + 1}.{" "}
                                  {lesson.title}
                                </p>

                                {lesson.duration && (
                                  <p className="mt-1 text-xs text-slate-500">
                                    {lesson.duration}
                                  </p>
                                )}
                              </div>

                              {/* Arrow */}
                              <HiChevronRight className="h-4 w-4 flex-shrink-0 text-slate-400" />
                            </Link>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default CourseModules;