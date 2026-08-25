import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  HiOutlineBookOpen,
  HiOutlineArrowRight,
  HiOutlinePlay,
  HiOutlineSparkles,
  HiOutlineClock,
  HiOutlineAcademicCap,
} from "react-icons/hi";

import enrollmentService from "../../services/enrollmentService";

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  // =====================================================
  // LOAD ENROLLMENTS
  // =====================================================
  useEffect(() => {
    let mounted = true;

    enrollmentService
      .listMine()
      .then(({ data }) => {
        if (!mounted) return;

        setEnrollments(data?.data?.items || []);
        setStatus("success");
      })
      .catch((err) => {
        if (!mounted) return;

        setError(
          err.response?.data?.message ||
            "Couldn't load your courses."
        );

        setStatus("error");
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>My Courses | American FutureTech</title>
      </Helmet>

      <div className="space-y-6">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-[#141E32] p-6 text-white shadow-xl shadow-slate-900/15 sm:p-8">

          {/* Decorative shapes */}
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary-600/20" />

          <div className="absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-primary-500/5" />

          <div className="absolute right-24 top-12 h-2 w-2 rounded-full bg-primary-300/40" />

          <div className="absolute right-40 top-24 h-1.5 w-1.5 rounded-full bg-white/20" />

          <div className="relative z-10 flex flex-col justify-between gap-7 sm:flex-row sm:items-center">

            {/* Left content */}
            <div className="max-w-2xl">

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-sm">
                <HiOutlineSparkles className="h-4 w-4 text-primary-300" />
                Learning Center
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                My Courses
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Continue your courses, track your progress,
                and keep building the skills that move your
                career forward.
              </p>
            </div>

            {/* Right icon */}
            <div className="hidden h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md sm:flex">
              <HiOutlineAcademicCap className="h-10 w-10 text-primary-300" />
            </div>

          </div>
        </section>

        {/* =====================================================
            LOADING
        ====================================================== */}
        {status === "loading" && (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

            {[1, 2].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="h-36 animate-pulse bg-[#141E32]" />

                <div className="space-y-4 p-5">

                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

                  <div className="h-3 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

                  <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />

                </div>
              </div>
            ))}

          </div>
        )}

        {/* =====================================================
            ERROR
        ====================================================== */}
        {status === "error" && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm dark:border-red-900 dark:bg-slate-900">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500 dark:bg-red-950/50">
              !
            </div>

            <h2 className="mt-4 font-bold text-slate-900 dark:text-white">
              Unable to load your courses
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {error}
            </p>

          </div>
        )}

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}
        {status === "success" && enrollments.length === 0 && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            <div className="flex flex-col items-center px-6 py-14 text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#141E32] text-white shadow-lg">
                <HiOutlineBookOpen className="h-9 w-9 text-primary-300" />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
                Your learning journey starts here
              </h2>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-400">
                You haven't enrolled in any courses yet.
                Explore our programs and start learning today.
              </p>

              <Link
                to="/courses"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#141E32] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#1A2740] hover:shadow-xl"
              >
                Browse Courses

                <HiOutlineArrowRight className="h-4 w-4" />
              </Link>

            </div>
          </div>
        )}

        {/* =====================================================
            COURSES
        ====================================================== */}
        {status === "success" && enrollments.length > 0 && (
          <>
            {/* Section heading */}
            <div className="flex items-end justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your Learning Programs
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {enrollments.length}{" "}
                  {enrollments.length === 1
                    ? "course"
                    : "courses"}{" "}
                  enrolled
                </p>
              </div>

            </div>

            {/* Course grid */}
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

              {enrollments.map((enrollment) => {
                const course = enrollment.course;

                const progress = Math.min(
                  Math.max(
                    Number(enrollment.progress) || 0,
                    0
                  ),
                  100
                );

                const isCompleted = progress === 100;

                return (
                  <article
                    key={enrollment.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                  >

                    {/* =================================================
                        COURSE TOP
                    ================================================== */}
                    <div className="relative overflow-hidden bg-[#141E32] px-5 py-5 text-white">

                      <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-primary-600/20" />

                      <div className="absolute -bottom-16 right-20 h-28 w-28 rounded-full bg-primary-500/5" />

                      <div className="absolute right-10 top-8 h-1.5 w-1.5 rounded-full bg-white/20" />

                      <div className="relative flex items-start justify-between gap-4">

                        {/* Course icon */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                          <HiOutlineBookOpen className="h-6 w-6 text-primary-300" />
                        </div>

                        {/* Status */}
                        <span
                          className={`rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-sm ${
                            isCompleted
                              ? "border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                              : "border-white/10 bg-white/5 text-slate-300"
                          }`}
                        >
                          {isCompleted
                            ? "Completed"
                            : "In Progress"}
                        </span>

                      </div>

                      {/* Course title */}
                      <div className="relative mt-5">

                        <h3 className="line-clamp-2 text-lg font-bold leading-7 text-white">
                          {course?.title || "Untitled Course"}
                        </h3>

                        {/* Course meta */}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">

                          <span className="inline-flex items-center gap-1.5">
                            <HiOutlineClock className="h-3.5 w-3.5 text-primary-300" />

                            {course?.duration || "N/A"}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-slate-600" />

                          <span>
                            {course?.level || "N/A"}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* =================================================
                        WHITE CENTER CONTENT
                    ================================================== */}
                    <div className="p-5">

                      {/* Progress */}
                      <div className="flex items-center justify-between">

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Course Progress
                          </p>

                          <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white">
                            {progress}%
                          </p>
                        </div>

                        {/* Percentage circle */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-100 bg-primary-50 text-xs font-bold text-primary-600 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-400">
                          {progress}%
                        </div>

                      </div>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-700"
                            style={{
                              width: `${progress}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Bottom row */}
                      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                            {isCompleted
                              ? "Course completed"
                              : "Keep learning to reach your goal"}
                          </p>

                          {!isCompleted && (
                            <p className="mt-1 text-[11px] text-slate-400">
                              You're making progress.
                            </p>
                          )}
                        </div>

                        {/* Continue */}
                        <Link
                          to={`/dashboard/courses/${course?.id}/modules`}
                          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#141E32] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-slate-900/10 transition duration-200 hover:-translate-y-0.5 hover:bg-[#1A2740] hover:shadow-lg sm:w-auto"
                        >
                          <HiOutlinePlay className="h-4 w-4 text-primary-300" />

                          {isCompleted
                            ? "View Course"
                            : "Continue"}

                          <HiOutlineArrowRight className="h-3.5 w-3.5" />
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          </>
        )}

        {/* =====================================================
            BOTTOM MOTIVATION
        ====================================================== */}
        {status === "success" && enrollments.length > 0 && (
          <section className="overflow-hidden rounded-2xl bg-[#141E32] p-5 text-white shadow-lg shadow-slate-900/10 sm:p-6">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <HiOutlineSparkles className="h-5 w-5 text-primary-300" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Keep learning. Keep growing.
                  </h3>

                  <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">
                    Every lesson completed is another step
                    toward your professional goals.
                  </p>
                </div>

              </div>

              <Link
                to="/dashboard/courses"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-[#141E32] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Continue Learning

                <HiOutlineArrowRight className="h-4 w-4" />
              </Link>

            </div>

          </section>
        )}

      </div>
    </>
  );
};

export default MyCourses;