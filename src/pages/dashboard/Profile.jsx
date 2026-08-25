import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

import {
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlinePencil,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineBookOpen,
  HiOutlineArrowRight,
  HiOutlineClock,
  HiOutlineAcademicCap,
} from "react-icons/hi";

import authService from "../../services/authService";
import { fetchProfile } from "../../redux/slices/authSlice";
import enrollmentService from "../../services/enrollmentService";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // =====================================================
  // PROFILE FORM
  // =====================================================
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    },
  });

  // =====================================================
  // PROFILE STATUS
  // =====================================================
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState(null);

  // =====================================================
  // ENROLLED COURSES
  // =====================================================
  const [enrollments, setEnrollments] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  // =====================================================
  // KEEP FORM SYNCED WITH REDUX USER
  // =====================================================
  useEffect(() => {
    reset({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
    });
  }, [user, reset]);

  // =====================================================
  // LOAD ENROLLED COURSES
  // =====================================================
  useEffect(() => {
    let mounted = true;

    const loadEnrollments = async () => {
      setCoursesLoading(true);
      setCoursesError(null);

      try {
        const { data } = await enrollmentService.listMine();

        if (!mounted) return;

        const items = data?.data?.items || [];

        setEnrollments(items);
      } catch (err) {
        if (!mounted) return;

        console.error(
          "Failed to load enrolled courses:",
          err
        );

        setCoursesError(
          err.response?.data?.message ||
            "Couldn't load your enrolled courses."
        );

        setEnrollments([]);
      } finally {
        if (mounted) {
          setCoursesLoading(false);
        }
      }
    };

    loadEnrollments();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // SAVE PROFILE
  // =====================================================
  const onSubmit = async (data) => {
    setStatus("idle");
    setErrorMessage(null);

    try {
      await authService.updateProfile({
        fullName: data.fullName,
        phone: data.phone,
      });

      await dispatch(fetchProfile());

      setStatus("success");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          "Couldn't save your changes. Please try again."
      );

      setStatus("error");
    }
  };

  // =====================================================
  // USER NAME
  // =====================================================
  const userName =
    user?.fullName ||
    user?.name ||
    user?.username ||
    "Student";

  // =====================================================
  // INITIALS
  // =====================================================
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((name) => name.charAt(0).toUpperCase())
    .join("");

  // =====================================================
  // TOTAL ENROLLED
  // =====================================================
  const enrolledCount = enrollments.length;

  return (
    <>
      <Helmet>
        <title>Profile | American FutureTech</title>
      </Helmet>

      <div className="space-y-6">

        {/* =====================================================
            PROFILE HERO
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#141E32] p-6 text-white shadow-[0_20px_50px_-20px_rgba(20,30,50,0.45)] sm:p-8">

          {/* Decorative elements */}
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/[0.035]" />

          <div className="absolute -bottom-28 right-28 h-56 w-56 rounded-full bg-white/[0.02]" />

          <div className="absolute right-20 top-12 h-2 w-2 rounded-full bg-white/20" />

          <div className="absolute right-36 top-24 h-1.5 w-1.5 rounded-full bg-white/20" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* Avatar */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-2xl font-extrabold shadow-lg">

              {initials || (
                <HiOutlineUserCircle className="h-12 w-12 text-primary-300" />
              )}

            </div>

            {/* User information */}
            <div className="min-w-0">

              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-sm">

                <HiOutlineSparkles className="h-4 w-4 text-primary-300" />

                Student Profile

              </div>

              <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">
                {userName}
              </h1>

              <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">

                <HiOutlineMail className="h-4 w-4 text-primary-300" />

                {user?.email || "No email available"}

              </p>

            </div>

          </div>
        </section>

        {/* =====================================================
            CONTENT
        ====================================================== */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* =================================================
              LEFT - PROFILE INFORMATION
          ================================================== */}
          <div className="lg:col-span-2">

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              {/* Card header */}
              <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141E32] text-white">
                    <HiOutlinePencil className="h-5 w-5" />
                  </div>

                  <div>

                    <h2 className="font-bold text-slate-900 dark:text-white">
                      Personal Information
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Update your account information
                    </p>

                  </div>

                </div>

              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5 p-6"
              >

                {/* Full Name */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Full Name
                  </label>

                  <div className="relative">

                    <HiOutlineUserCircle className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      {...register("fullName", {
                        required: "Full name is required",
                      })}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-800"
                      placeholder="Enter your full name"
                    />

                  </div>
                </div>

                {/* Phone */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Phone Number
                  </label>

                  <div className="relative">

                    <HiOutlinePhone className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      {...register("phone")}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-800"
                      placeholder="Enter your phone number"
                    />

                  </div>
                </div>

                {/* Email */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Email Address
                  </label>

                  <div className="relative">

                    <HiOutlineMail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 py-3 pl-11 pr-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                    />

                  </div>

                  <p className="mt-1.5 text-xs text-slate-400">
                    Email is your account identifier and cannot
                    be edited here.
                  </p>

                </div>

                {/* Success */}
                {status === "success" && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                    Profile updated successfully.
                  </div>
                )}

                {/* Error */}
                {status === "error" && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                    {errorMessage}
                  </div>
                )}

                {/* Save */}
                <div className="flex justify-end border-t border-slate-100 pt-5 dark:border-slate-800">

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#141E32] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-[#1d2a43] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    <HiOutlinePencil className="h-4 w-4 text-primary-300" />

                    {isSubmitting
                      ? "Saving Changes..."
                      : "Save Changes"}

                  </button>

                </div>

              </form>
            </div>
          </div>

          {/* =================================================
              RIGHT COLUMN
          ================================================== */}
          <div className="space-y-5">

            {/* =================================================
                ENROLLED COURSES
            ================================================== */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              {/* Header */}
              <div className="border-b border-slate-100 px-5 py-5 dark:border-slate-800">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#141E32] text-white">
                      <HiOutlineBookOpen className="h-5 w-5 text-primary-300" />
                    </div>

                    <div>

                      <h3 className="font-bold text-slate-900 dark:text-white">
                        My Courses
                      </h3>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {coursesLoading
                          ? "Loading..."
                          : `${enrolledCount} ${
                              enrolledCount === 1
                                ? "course"
                                : "courses"
                            } enrolled`}
                      </p>

                    </div>

                  </div>

                </div>
              </div>

              {/* Loading */}
              {coursesLoading && (
                <div className="space-y-3 p-5">

                  {[1, 2].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-xl bg-slate-50 p-4 dark:bg-slate-800"
                    >

                      <div className="h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />

                      <div className="mt-2 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />

                      <div className="mt-4 h-2 w-full rounded bg-slate-200 dark:bg-slate-700" />

                    </div>
                  ))}

                </div>
              )}

              {/* Error */}
              {!coursesLoading && coursesError && (
                <div className="p-5">

                  <div className="rounded-xl bg-red-50 p-4 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-300">
                    {coursesError}
                  </div>

                </div>
              )}

              {/* No courses */}
              {!coursesLoading &&
                !coursesError &&
                enrollments.length === 0 && (
                  <div className="p-5 text-center">

                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 dark:bg-slate-800">

                      <HiOutlineBookOpen className="h-6 w-6" />

                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      No enrolled courses
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      You haven't registered for any course yet.
                    </p>

                    <Link
                      to="/courses"
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#141E32] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#1d2a43]"
                    >
                      Browse Courses
                      <HiOutlineArrowRight className="h-3.5 w-3.5" />
                    </Link>

                  </div>
                )}

              {/* Course List */}
              {!coursesLoading &&
                !coursesError &&
                enrollments.length > 0 && (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">

                    {enrollments.map((enrollment) => {
                      const course = enrollment.course;

                      const progress = Math.min(
                        Math.max(
                          Number(enrollment.progress) || 0,
                          0
                        ),
                        100
                      );

                      return (
                        <div
                          key={enrollment.id}
                          className="group p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        >

                          {/* Course title */}
                          <div className="flex items-start gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#141E32] text-primary-300">

                              <HiOutlineAcademicCap className="h-5 w-5" />

                            </div>

                            <div className="min-w-0 flex-1">

                              <h4 className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-white">
                                {course?.title ||
                                  "Untitled Course"}
                              </h4>

                              <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">

                                <HiOutlineClock className="h-3.5 w-3.5" />

                                <span>
                                  {course?.duration ||
                                    "Duration N/A"}
                                </span>

                                <span>
                                  •
                                </span>

                                <span>
                                  {course?.level ||
                                    "N/A"}
                                </span>

                              </div>

                            </div>

                          </div>

                          {/* Progress */}
                          <div className="mt-4">

                            <div className="mb-1.5 flex items-center justify-between">

                              <span className="text-[11px] font-semibold text-slate-400">
                                Progress
                              </span>

                              <span className="text-[11px] font-bold text-primary-600 dark:text-primary-400">
                                {progress}%
                              </span>

                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">

                              <div
                                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                                style={{
                                  width: `${progress}%`,
                                }}
                              />

                            </div>

                          </div>

                          {/* Continue */}
                          <Link
                            to={`/dashboard/courses/${course?.id}/modules`}
                            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-[#141E32] transition hover:border-[#141E32] hover:bg-[#141E32] hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-[#141E32]"
                          >
                            {progress === 100
                              ? "View Course"
                              : "Continue Learning"}

                            <HiOutlineArrowRight className="h-3.5 w-3.5" />
                          </Link>

                        </div>
                      );
                    })}

                  </div>
                )}

            </div>

            {/* =================================================
                ACCOUNT SECURITY
            ================================================== */}
            {/* <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              <div className="bg-[#141E32] p-5 text-white">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">

                  <HiOutlineShieldCheck className="h-6 w-6 text-primary-300" />

                </div>

                <h3 className="mt-4 font-bold">
                  Account Security
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Your account information is protected and
                  securely managed.
                </p>

              </div>

              <div className="space-y-4 p-5">

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Account Status
                  </span>

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">

                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    Active

                  </span>

                </div>

                <div className="flex items-center justify-between">

                  <span className="text-sm text-slate-500">
                    Account Type
                  </span>

                  <span className="text-sm font-semibold text-slate-800 dark:text-white">
                    Student
                  </span>

                </div>

              </div>

            </div> */}

            {/* =================================================
                KEEP LEARNING
            ================================================== */}
            <div className="relative overflow-hidden rounded-2xl bg-[#141E32] p-5 text-white shadow-lg shadow-slate-900/10">

              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.035]" />

              <div className="relative">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">

                  <HiOutlineSparkles className="h-5 w-5 text-primary-300" />

                </div>

                <h3 className="mt-4 font-bold">
                  Keep Learning
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Continue your courses and keep moving toward
                  your career goals.
                </p>

                <Link
                  to="/dashboard/courses"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-[#141E32] transition hover:bg-slate-100"
                >
                  View Courses
                  <HiOutlineArrowRight className="h-3.5 w-3.5" />
                </Link>

              </div>

            </div>

          </div>

        </div>
      </div>
    </>
  );
};

export default Profile;import { useEffect, useState } from "react";
