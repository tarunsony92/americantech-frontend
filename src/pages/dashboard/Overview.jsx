import { useEffect, useState,useMemo } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  HiOutlineBookOpen,
  HiOutlineBadgeCheck,
  HiOutlineDocumentText,
  HiOutlineArrowRight,
  HiOutlinePlay,
  HiOutlineUserCircle,
  HiOutlineSparkles,
} from "react-icons/hi";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const Overview = () => {
  const { user } = useSelector((state) => state.auth);

  const [enrolledCount, setEnrolledCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // =====================================================
  // USER NAME
  // =====================================================
  const userName = useMemo(() => {
    if (!user) return "Student";

    if (user.fullName) return user.fullName;
    if (user.name) return user.name;

    const firstName =
      user.firstName ||
      user.first_name ||
      "";

    const lastName =
      user.lastName ||
      user.last_name ||
      "";

    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || user.username || "Student";
  }, [user]);

  // =====================================================
  // FIRST NAME
  // =====================================================
  const firstName = useMemo(() => {
    return userName.split(" ")[0] || "Student";
  }, [userName]);

  // =====================================================
  // GREETING
  // =====================================================
  const greeting = useMemo(() => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";

    return "Good evening";
  }, []);

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================
  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        const [enrollmentsRes, certificatesRes] =
          await Promise.all([
            axiosInstance.get("/enrollments/mine"),
            axiosInstance.get("/certificates/mine"),
          ]);

        if (!isMounted) return;

        const enrollments =
          enrollmentsRes.data?.data?.items || [];

        const certificates =
          certificatesRes.data?.data?.items || [];

        setEnrolledCount(enrollments.length);
        setCertificateCount(certificates.length);
      } catch (error) {
        if (!isMounted) return;

        console.error(
          "Dashboard data error:",
          error
        );

        setEnrolledCount(0);
        setCertificateCount(0);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  // =====================================================
  // STATS
  // =====================================================
  const stats = [
    {
      label: "Enrolled Courses",
      value: loading ? "..." : enrolledCount,
      description:
        "Courses you're currently learning",
      icon: HiOutlineBookOpen,
      iconClass:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      label: "Certificates Earned",
      value: loading ? "..." : certificateCount,
      description:
        "Achievements you've completed",
      icon: HiOutlineBadgeCheck,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      label: "Job Applications",
      value: 0,
      description:
        "Applications submitted",
      icon: HiOutlineDocumentText,
      iconClass:
        "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Dashboard | American FutureTech
        </title>
      </Helmet>

      <div className="space-y-7">

        {/* =====================================================
            WELCOME HERO
        ====================================================== */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#141E32] px-6 py-7 text-white shadow-[0_20px_50px_-20px_rgba(20,30,50,0.45)] sm:px-8 sm:py-9">

          {/* Decorative circles */}
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/[0.035]" />

          <div className="absolute -bottom-28 right-24 h-56 w-56 rounded-full bg-white/[0.02]" />

          <div className="absolute right-20 top-10 h-2 w-2 rounded-full bg-white/20" />

          <div className="absolute right-36 top-24 h-1.5 w-1.5 rounded-full bg-white/30" />

          <div className="absolute bottom-12 right-16 h-2 w-2 rounded-full bg-white/20" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

            {/* Left */}
            <div className="max-w-2xl">

              {/* Badge */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-sm">
                <HiOutlineSparkles className="h-4 w-4 text-primary-400" />
                Student Dashboard
              </div>

              {/* Heading */}
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                {greeting},{" "}
                <span className="text-white">
                  {userName}
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Continue your learning journey, build
                your skills, and take the next step
                toward your career goals.
              </p>

              {/* Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">

                <Link
                  to="/dashboard/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#141E32] shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-xl"
                >
                  <HiOutlinePlay className="h-4 w-4" />
                  Continue Learning
                </Link>

                <Link
                  to="/dashboard/profile"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur-sm transition hover:bg-white/10"
                >
                  <HiOutlineUserCircle className="h-4 w-4" />
                  View Profile
                </Link>

              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:flex lg:w-64 lg:justify-end">

              <div className="relative flex h-40 w-40 items-center justify-center rounded-[28px] border border-white/10 bg-white/[0.04]">

                <div className="absolute inset-5 rounded-2xl border border-white/[0.06]" />

                <div className="absolute inset-10 rounded-xl border border-white/[0.05]" />

                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/[0.035] shadow-2xl ring-1 ring-white/10">
                  <HiOutlineBookOpen className="h-12 w-12 text-primary-300" />
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =====================================================
            LEARNING OVERVIEW
        ====================================================== */}
        <section>

          <div className="mb-4 flex items-end justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Your Learning Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                A quick look at your current learning activity.
              </p>
            </div>

          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_-18px_rgba(15,23,42,0.25)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_18px_40px_-20px_rgba(15,23,42,0.28)]"
                >

                  <div className="flex items-start justify-between">

                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconClass}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 transition group-hover:bg-primary-50 dark:bg-slate-800 dark:group-hover:bg-primary-950/40">
                      <HiOutlineArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary-500" />
                    </div>

                  </div>

                  <div className="mt-5">

                    <p className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {stat.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {stat.description}
                    </p>

                  </div>
                </div>
              );
            })}

          </div>
        </section>

        {/* =====================================================
            QUICK ACTIONS + PROFILE
        ====================================================== */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* =================================================
              QUICK ACTIONS
          ================================================== */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">

            <div className="mb-5">

              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Jump directly to the section you need.
              </p>

            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

              {/* My Courses */}
              <Link
                to="/dashboard/courses"
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-900 dark:hover:bg-primary-950/20"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
                    <HiOutlineBookOpen className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      My Courses
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Continue your courses
                    </p>
                  </div>

                </div>

                <HiOutlineArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary-500" />

              </Link>

              {/* Certificates */}
              <Link
                to="/dashboard/certificates"
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50/40 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-primary-900 dark:hover:bg-primary-950/20"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-950/50 dark:text-primary-400">
                    <HiOutlineBadgeCheck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      Certificates
                    </p>

                    <p className="mt-0.5 text-xs text-slate-400">
                      View your achievements
                    </p>
                  </div>

                </div>

                <HiOutlineArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-primary-500" />

              </Link>

            </div>
          </div>

          {/* =================================================
              PROFILE / KEEP LEARNING CARD
          ================================================== */}
          <div className="relative overflow-hidden rounded-2xl bg-[#141E32] p-6 text-white shadow-xl shadow-slate-900/15">

            {/* Decorative circle */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.035]" />

            <div className="absolute -bottom-16 right-12 h-28 w-28 rounded-full bg-primary-500/5" />

            {/* Content */}
            <div className="relative">

              {/* Student */}
              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-500/15 ring-1 ring-white/10">
                  <HiOutlineUserCircle className="h-7 w-7 text-primary-300" />
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-bold text-white">
                    {userName}
                  </p>

                  <p className="truncate text-xs text-slate-400">
                    {user?.email || "Student Account"}
                  </p>

                </div>

              </div>

              {/* Divider */}
              <div className="my-6 h-px bg-white/10" />

              {/* Label */}
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Keep Learning
              </p>

              {/* Heading */}
              <p className="mt-3 text-xl font-bold leading-8 text-white">
                Your next achievement is waiting.
              </p>

              {/* Description */}
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Stay consistent with your learning and keep
                building skills that move your career forward.
              </p>

              {/* Button */}
              <Link
                to="/dashboard/profile"
                className="mt-6 inline-flex items-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#141E32] transition duration-200 hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Manage Profile

                <HiOutlineArrowRight className="h-5 w-5" />
              </Link>

            </div>
          </div>

        </section>

        {/* =====================================================
            BOTTOM MOTIVATION
        ====================================================== */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#141E32] text-white shadow-sm">
                <HiOutlineSparkles className="h-5 w-5" />
              </div>

              <div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Keep going, {firstName}!
                </h3>

                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Every lesson you complete takes you one
                  step closer to your goals.
                </p>

              </div>

            </div>

            <Link
              to="/dashboard/courses"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#141E32] px-5 py-3 text-xs font-bold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#1d2a43]"
            >
              Start Learning

              <HiOutlineArrowRight className="h-4 w-4" />
            </Link>

          </div>
        </section>

      </div>
    </>
  );
};

export default Overview;
