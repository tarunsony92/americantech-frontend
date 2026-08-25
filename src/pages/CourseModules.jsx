import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import {
  HiChevronDown,
  HiChevronRight,
  HiOutlineArrowLeft,
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlinePlay,
  HiOutlineSparkles,
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

    let mounted = true;

    courseService
      .getContent(id)
      .then(({ data }) => {
        if (!mounted) return;

        const courseData = data?.data;

        if (!courseData) {
          throw new Error("Course data not found.");
        }

        setCourse(courseData);

        const firstModule = courseData.modules?.[0];
        if (firstModule) {
          setOpenModuleId(firstModule.id);
        }

        setStatus("success");
      })
      .catch((err) => {
        if (!mounted) return;

        setError(
          err.response?.data?.message ||
            err.message ||
            "Couldn't load course modules."
        );
        setStatus("error");
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const toggleModule = (moduleId) => {
    setOpenModuleId((prev) => (prev === moduleId ? null : moduleId));
  };

  if (status === "loading") {
    return (
      <div className="space-y-6">
        <div className="h-5 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />

        <div className="overflow-hidden rounded-3xl bg-[#141E32] p-6 shadow-xl sm:p-8">
          <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
          <div className="mt-4 h-9 w-2/3 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-white/10" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-6">
        <Link
          to="/my-courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:gap-3 dark:text-primary-400"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to My Courses
        </Link>

        <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm dark:border-red-900 dark:bg-slate-900">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-950/40">
            !
          </div>

          <h2 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
            Unable to load course
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            {error}
          </p>

          <Link
            to="/my-courses"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#141E32] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#1A2740]"
          >
            Return to My Courses
            <HiChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!course) return null;

  const modules = course.modules || [];
  const totalLessons = modules.reduce(
    (total, module) => total + (module.lessons?.length || 0),
    0
  );

  return (
    <>
      <Helmet>
        <title>{course.title} | Course Modules | American FutureTech</title>
      </Helmet>

      <div className="space-y-6">
        {/* Back */}
        <Link
          to="/my-courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 transition hover:gap-3 dark:text-primary-400"
        >
          <HiOutlineArrowLeft className="h-4 w-4" />
          Back to My Courses
        </Link>

        {/* Course hero */}
        <section className="relative overflow-hidden rounded-3xl bg-[#141E32] px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8 sm:py-9">
          <div className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-primary-600/20" />
          <div className="absolute -bottom-28 right-32 h-56 w-56 rounded-full bg-primary-500/5" />
          <div className="absolute right-16 top-12 h-2 w-2 rounded-full bg-primary-300/50" />

          <div className="relative z-10 flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-sm">
                <HiOutlineSparkles className="h-4 w-4 text-primary-300" />
                Course Learning Hub
              </div>

              <h1 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
                {course.title}
              </h1>

              {/* {course.description && (
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  {course.description}
                </p>
              )} */}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                  <HiOutlineBookOpen className="h-4 w-4 text-primary-300" />
                  {modules.length}{" "}
                  {modules.length === 1 ? "Module" : "Modules"}
                </span>

                <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                  <HiOutlinePlay className="h-4 w-4 text-primary-300" />
                  {totalLessons}{" "}
                  {totalLessons === 1 ? "Lesson" : "Lessons"}
                </span>

                {course.duration && (
                  <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300">
                    <HiOutlineClock className="h-4 w-4 text-primary-300" />
                    {course.duration}
                  </span>
                )}
              </div>
            </div>

            <div className="hidden h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md sm:flex">
              <HiOutlineAcademicCap className="h-10 w-10 text-primary-300" />
            </div>
          </div>
        </section>

        {/* Section heading */}
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Course Content
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Select a lesson to continue your learning journey.
            </p>
          </div>

          <span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 sm:inline-flex dark:bg-slate-800 dark:text-slate-300">
            {modules.length} {modules.length === 1 ? "module" : "modules"}
          </span>
        </div>

        {/* Modules */}
        {modules.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#141E32] text-primary-300">
              <HiOutlineBookOpen className="h-8 w-8" />
            </div>

            <h2 className="mt-5 font-bold text-slate-900 dark:text-white">
              No modules available
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Course content has not been added yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((module, index) => {
              const isOpen = openModuleId === module.id;
              const lessons = module.lessons || [];

              return (
                <article
                  key={module.id}
                  className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 dark:bg-slate-900 ${
                    isOpen
                      ? "border-primary-200 shadow-md shadow-primary-600/5 dark:border-primary-900"
                      : "border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleModule(module.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-slate-50 dark:hover:bg-slate-800/50 sm:px-6"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                          isOpen
                            ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-400">
                          Module {index + 1}
                        </p>

                        <h3 className="mt-1 truncate text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                          {module.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {lessons.length}{" "}
                          {lessons.length === 1 ? "lesson" : "lessons"}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition ${
                        isOpen
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {isOpen ? (
                        <HiChevronDown className="h-5 w-5" />
                      ) : (
                        <HiChevronRight className="h-5 w-5" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 dark:border-slate-800">
                      {lessons.length === 0 ? (
                        <div className="bg-slate-50/60 px-6 py-6 dark:bg-slate-950/30">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            No lessons available in this module yet.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-slate-50/50 p-2 dark:bg-slate-950/30 sm:p-3">
                          <div className="space-y-1.5">
                            {lessons.map((lesson, lessonIndex) => (
                              <Link
                                key={lesson.id}
                                to={`/dashboard/courses/${course.id}/learn?lesson=${lesson.id}`}
                                className="group flex items-center gap-3 rounded-xl border border-transparent bg-white px-3 py-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-primary-100 hover:bg-primary-50/50 hover:shadow-sm dark:bg-slate-900 dark:hover:border-primary-900 dark:hover:bg-slate-800"
                              >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-950/50 dark:text-primary-400">
                                  <HiOutlinePlay className="h-4 w-4" />
                                </div>

                                <div className="min-w-0 flex-1">
                                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                    <span className="mr-1 text-slate-400">
                                      {lessonIndex + 1}.
                                    </span>
                                    {lesson.title}
                                  </p>

                                  {lesson.duration && (
                                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
                                      <HiOutlineClock className="h-3.5 w-3.5" />
                                      {lesson.duration}
                                    </p>
                                  )}
                                </div>

                                <HiChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary-500" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom CTA */}
        {modules.length > 0 && totalLessons > 0 && (
          <section className="overflow-hidden rounded-2xl bg-[#141E32] px-5 py-5 text-white shadow-lg shadow-slate-900/10 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <HiOutlineSparkles className="h-5 w-5 text-primary-300" />
                </div>

                <div>
                  <h3 className="text-sm font-bold">
                    Ready to continue learning?
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Open a lesson and continue where you left off.
                  </p>
                </div>
              </div>

              <Link
                to={`/dashboard/courses/${course.id}/learn`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#141E32] transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Start Learning
                <HiChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default CourseModules;
