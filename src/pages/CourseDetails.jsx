import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiStar,
  HiCheckCircle,
  HiChevronDown,
  HiOutlineBriefcase,
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck,
  HiOutlineDesktopComputer,
  HiSparkles,
} from "react-icons/hi";
import PageHeader from "../components/PageHeader";
import CTA from "../components/CTA";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import useResourceItem from "../hooks/useResourceItem";
import { formatCurrencyUSD } from "../utils/format";
import { COURSE_CONTENT, getCourseContentKey } from "../data/courseContent";

// ---- Fallback / default content (used only when a course matches NOTHING) ----

const DEFAULT_TOOLS = [
  "Python", "Kali Linux", "Nmap", "Metasploit", "Wireshark", "Burp Suite", "Nessus", "Hashcat",
];

const DEFAULT_CURRICULUM = [
  { title: "Module 1: Foundations & Core Concepts", desc: "Build the base knowledge you'll rely on through the rest of the program." },
  { title: "Module 2: Core Tools & Environment Setup", desc: "Get hands-on with the primary tools and workflows used in the field." },
  { title: "Module 3: Hands-On Project Sprint 1", desc: "Apply what you've learned to a guided, real-world style project." },
  { title: "Module 4: Advanced Topics & Techniques", desc: "Go deeper into advanced concepts and industry-standard practices." },
  { title: "Module 5: Hands-On Project Sprint 2", desc: "A second project sprint to reinforce and extend your skills." },
  { title: "Module 6: Capstone Project", desc: "Bring everything together in a portfolio-ready capstone build." },
  { title: "Module 7: Interview Preparation & Mock Interviews", desc: "Resume building, mock interviews and career guidance to help you land the role." },
];

const DEFAULT_CAPSTONE_PROJECTS = [
  { tag: "Project 1", title: "Real-World Practice Build", desc: "Apply the core skills from this course to a guided, real-world style project.", color: "from-violet-500 to-fuchsia-500" },
  { tag: "Project 2", title: "Portfolio Capstone", desc: "A larger capstone project designed to showcase your skills to employers.", color: "from-sky-500 to-cyan-500" },
];

const DEFAULT_WHY_CHOOSE = [
  {
    icon: HiOutlineDesktopComputer,
    title: "Doubt Clearing Sessions",
    desc: "Get your questions answered live by expert mentors anytime during the program.",
    color: "from-orange-400 to-pink-500",
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Industry Relevant Projects",
    desc: "Build a portfolio with hands-on projects that mirror real-world challenges.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    icon: HiCheckCircle,
    title: "Assignment Evaluation",
    desc: "Every assignment is reviewed and graded with detailed personalised feedback.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: HiOutlineDesktopComputer,
    title: "Lab For Your Practice",
    desc: "Access a dedicated virtual lab environment to practice safely.",
    color: "from-purple-400 to-violet-500",
  },
  {
    icon: HiOutlineAcademicCap,
    title: "Industry Experts Live",
    desc: "Learn directly from active professionals in live interactive sessions.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: HiOutlineBriefcase,
    title: "3+ Career Sessions",
    desc: "Resume building, mock interviews, and career guidance to land your dream role.",
    color: "from-rose-400 to-red-500",
  },
];

const DEFAULT_WHO_CAN_APPLY = [
  "Individuals already working in IT, software development, or related fields who want to specialize in this domain.",
  "Professionals who want to upgrade their careers, with at least 50% marks in their graduation final result.",
  "Individuals with a simple background and at least 60% marks in higher secondary education.",
  "Anyone who wants ample career options and competitive salaries in this field.",
];

const DEFAULT_CAREER_ROLE_COLORS = [
  { name: "Analyst", color: "from-blue-500 to-cyan-500" },
  { name: "Engineer", color: "from-violet-500 to-purple-500" },
  { name: "Consultant", color: "from-emerald-500 to-green-500" },
  { name: "Specialist", color: "from-amber-500 to-yellow-500" },
  { name: "Team Lead", color: "from-rose-500 to-pink-500" },
  { name: "Project Manager", color: "from-indigo-500 to-blue-500" },
];

const TOOL_COLORS = [
  "from-red-500 to-orange-500",
  "from-orange-500 to-amber-500",
  "from-amber-500 to-yellow-500",
  "from-emerald-500 to-teal-500",
  "from-teal-500 to-cyan-500",
  "from-cyan-500 to-blue-500",
  "from-blue-500 to-indigo-500",
  "from-violet-500 to-fuchsia-500",
];

// ---- Small reusable UI pieces ----

const SectionHeading = ({ eyebrow, title, subtitle, center, accent = "text-primary-600" }) => (
  <div className={`mb-10 ${center ? "text-center" : ""}`}>
    {eyebrow && (
      <p className={`mb-2 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${accent}`}>
        <HiSparkles className="h-3.5 w-3.5" /> {eyebrow}
      </p>
    )}
    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">{title}</h2>
    {subtitle && (
      <p className={`mt-3 text-slate-600 dark:text-slate-300 ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
        {subtitle}
      </p>
    )}
  </div>
);

const AccordionItem = ({ item, isOpen, onToggle, color }) => (
  <div
    className={`overflow-hidden rounded-xl border-2 bg-white shadow-sm transition-colors dark:bg-slate-800/50 ${
      isOpen ? "border-transparent" : "border-slate-200 dark:border-slate-700"
    }`}
  >
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left ${
        isOpen ? `bg-gradient-to-r ${color} text-white` : ""
      }`}
    >
      <span className={`font-semibold ${isOpen ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>
        {item.title}
      </span>
      <HiChevronDown
        className={`h-5 w-5 flex-shrink-0 transition-transform ${isOpen ? "rotate-180 text-white" : "text-slate-400"}`}
      />
    </button>
    {isOpen && item.desc && (
      <div className="border-t border-slate-100 px-5 py-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
        {item.desc}
      </div>
    )}
  </div>
);

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // const { isAuthenticated } = useSelector((state) => state.auth);
  const { item: course, loading, error } = useResourceItem(courseService, id);
  const [enrollStatus, setEnrollStatus] = useState("idle"); // idle | loading | success | error
  const [enrollError, setEnrollError] = useState(null);
  const [openModule, setOpenModule] = useState(0);

  const handleEnroll = (type = "full") => {
  navigate(`/courses/${id}/checkout?type=${type}`);
};

  if (loading) {
    return <div className="container-page py-24 text-center text-slate-500">Loading course...</div>;
  }

  if (error || !course) {
    return <div className="container-page py-24 text-center text-red-500">{error || "Course not found."}</div>;
  }

  const categoryName = course.category?.name || "this field";

  // ---- Resolve content: backend data > matched static course content > generic defaults ----
  const contentKey = getCourseContentKey(course.title || "");
  const matched = contentKey ? COURSE_CONTENT[contentKey] : null;

  const tools = course.tools?.length ? course.tools : matched?.tools?.length ? matched.tools : DEFAULT_TOOLS;
  const curriculum = course.curriculum?.length ? course.curriculum : matched?.curriculum?.length ? matched.curriculum : DEFAULT_CURRICULUM;
  const capstoneProjects = course.capstoneProjects?.length
    ? course.capstoneProjects
    : matched?.capstoneProjects?.length
    ? matched.capstoneProjects
    : DEFAULT_CAPSTONE_PROJECTS;
  const whoCanApply = course.eligibility?.length ? course.eligibility : matched?.eligibility?.length ? matched.eligibility : DEFAULT_WHO_CAN_APPLY;

  const rawCareerRoles = course.careerRoles?.length
    ? course.careerRoles
    : matched?.careerRoles?.length
    ? matched.careerRoles
    : DEFAULT_CAREER_ROLE_COLORS.map((r) => r.name);

  const careerRoles = rawCareerRoles.map((r, i) => ({
    name: r,
    color: DEFAULT_CAREER_ROLE_COLORS[i % DEFAULT_CAREER_ROLE_COLORS.length].color,
  }));

  const moduleColors = ["from-indigo-500 to-blue-500", "from-violet-500 to-fuchsia-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500", "from-rose-500 to-pink-500", "from-cyan-500 to-sky-500", "from-purple-500 to-indigo-500"];

  return (
    <>
      <Helmet><title>{course.title} | American FutureTech</title></Helmet>
      <PageHeader
        title={course.title}
        // subtitle={categoryName}
        breadcrumbItems={[{ label: "Courses", to: "/courses" }, { label: course.title }]}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
  {/* Background Decorations */}
  <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-400/20 via-indigo-400/20 to-transparent blur-3xl" />
  <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-400/15 via-cyan-400/15 to-transparent blur-3xl" />

  <div className="container-page relative grid grid-cols-1 gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">
    
    {/* =========================================================
        LEFT CONTENT
    ========================================================= */}
    <div className="min-w-0">

      {/* Course Image */}
      {course.image && (
        <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-xl ring-1 ring-slate-900/5 dark:border-white/10 dark:bg-slate-900">
          <img
            src={course.image}
            alt={course.title}
            className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] sm:h-80 lg:h-[380px]"
          />

          {/* Image Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />

          {/* Course Title */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
            <span className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-indigo-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-indigo-300">
              {categoryName}
            </span>

            <h1 className="mt-3 max-w-3xl text-2xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-3xl lg:text-4xl">
              {course.title}
            </h1>
          </div>
        </div>
      )}

      {/* Course Meta */}
      <div className="mt-5 flex flex-wrap gap-2.5 text-sm">
        <span className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1.5 font-medium text-indigo-700 dark:border-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
          <HiOutlineClock className="h-4 w-4" />
          {course.duration}
        </span>

        <span className="flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1.5 font-medium text-violet-700 dark:border-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
          <HiOutlineAcademicCap className="h-4 w-4" />
          {course.level}
        </span>

        {course.rating && (
          <span className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            <HiStar className="h-4 w-4 text-amber-500" />
            {course.rating} rating
          </span>
        )}

        {course.instructor && (
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            Instructor: {course.instructor.fullName}
          </span>
        )}
      </div>

      <br /><br />

     

      {/* Quick Stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            icon: HiOutlineAcademicCap,
            value: "50%+",
            label: "Graduates & Freshers Welcome",
            color: "from-indigo-500 to-blue-500",
          },
          {
            icon: HiOutlineBriefcase,
            value: "5+",
            label: "Career Sessions Included",
            color: "from-fuchsia-500 to-pink-500",
          },
          {
            icon: HiOutlineGlobeAlt,
            value: "100%",
            label: "Online & Flexible Learning",
            color: "from-emerald-500 to-teal-500",
          },
          {
            icon: HiOutlineShieldCheck,
            value: "14+",
            label: "Tools Covered in Program",
            color: "from-amber-500 to-orange-500",
          },
          {
            icon: HiOutlineClock,
            value: course.duration || "Varies",
            label: "Program Duration",
            color: "from-cyan-500 to-sky-500",
          },
          {
            icon: HiOutlineDesktopComputer,
            value: course.level || "Varies",
            label: "Skill Level",
            color: "from-violet-500 to-purple-500",
          },
          {
            icon: HiStar,
            value: "Resume & Interview Prep",
            label: "Preparation",
            color: "from-rose-500 to-red-500",
          },
          {
            icon: HiSparkles,
            value: course.certification
              ? "Yes"
              : "Microsoft Certificate",
            label: "Certification Available",
            color: "from-indigo-500 to-fuchsia-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="group rounded-2xl border border-slate-200/70 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-slate-900"
          >
            <span
              className={`mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
            >
              <stat.icon className="h-5 w-5" />
            </span>

            <p className="mt-3 break-words text-lg font-extrabold leading-tight text-slate-900 dark:text-white sm:text-xl">
              {stat.value}
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>

    {/* =========================================================
        RIGHT — ENROLLMENT CARD
    ========================================================= */}
    <aside className="h-fit lg:sticky lg:top-24">
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-[1px] shadow-2xl">
        <div className="rounded-[23px] bg-white p-5 dark:bg-slate-900 sm:p-6">

          {/* Price */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Course Fee
            </p>

            <p className="mt-1 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {formatCurrencyUSD(course.price)}
            </p>
          </div>

          {/* Enroll */}
          {enrollStatus === "success" ? (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-900 dark:bg-emerald-950/50">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300">
                ✓
              </div>

              <p className="mt-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                You're enrolled!
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-600 dark:text-emerald-400">
                Check your dashboard for course access.
              </p>
            </div>
          ) : (
            <button
              onClick={() => handleEnroll("full")}
              disabled={enrollStatus === "loading"}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 py-3 font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {enrollStatus === "loading"
                ? "Enrolling..."
                : "Enroll Now"}
            </button>
          )}

          {enrollError && (
            <p className="mt-2 text-center text-xs font-medium text-red-500">
              {enrollError}
            </p>
          )}

          {/* Advisor */}
          <Link
            to="/contact"
            className="mt-3 block w-full rounded-xl border-2 border-indigo-200 py-3 text-center font-semibold text-indigo-700 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-950"
          >
            Talk to an Advisor
          </Link>

          {/* Course Details */}
          <div className="my-5 h-px bg-slate-200 dark:bg-white/10" />

          <dl className="space-y-3.5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500 dark:text-slate-400">
                Duration
              </dt>
              <dd className="text-right font-semibold text-slate-900 dark:text-white">
                {course.duration}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500 dark:text-slate-400">
                Level
              </dt>
              <dd className="text-right font-semibold text-slate-900 dark:text-white">
                {course.level}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4">
              <dt className="text-slate-500 dark:text-slate-400">
                Format
              </dt>
              <dd className="text-right font-semibold text-slate-900 dark:text-white">
                Online
              </dd>
            </div>
          </dl>

          {/* Trust */}
          <div className="mt-5 rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/70">
            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Secure enrollment • Expert-led learning
            </p>
          </div>
        </div>
      </div>
       {/* Overview */}
      <div className="mt-10">
        <h2 className="section-title bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
          Overview
        </h2>

        <p className="mt-4 max-w-4xl text-justify text-[15px] leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
  {course.description ||
    `This program takes you from fundamentals to job-ready skills in ${categoryName.toLowerCase()}, combining live instruction, hands-on projects, and mentor feedback across ${(course.duration || "the program").toLowerCase()}.`}
</p>
      </div>
    </aside>

    
  </div>
</section>

      {/* ---------------- TOOLS COVERED ---------------- */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 dark:from-slate-900/40 dark:to-slate-950">
  <div className="container-page">
    <SectionHeading
      center
      eyebrow="Hands-On Toolkit"
      title={`${course.title} Tools Covered`}
      subtitle="Master industry-leading tools used by professionals worldwide."
    />

    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {tools.map((tool, idx) => (
        <div
          key={tool}
          className="group flex flex-col items-center justify-center rounded-2xl bg-white p-6 text-center shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:bg-slate-800 dark:ring-slate-700"
        >
          <span
            className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${
              TOOL_COLORS[idx % TOOL_COLORS.length]
            } text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}
          >
            <HiOutlineShieldCheck className="h-6 w-6" />
          </span>

          <h3 className="text-sm font-semibold leading-6 text-slate-800 dark:text-slate-100">
            {tool}
          </h3>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <section className="container-page py-16">
        <SectionHeading
          center
          eyebrow="Why Us"
          title={`Why Get ${course.title} Certification From American FutureTech`}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DEFAULT_WHY_CHOOSE.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 transition-shadow hover:shadow-xl dark:bg-slate-800"
            >
              <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md`}>
                <item.icon className="h-6 w-6" />
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- WHO CAN APPLY ---------------- */}
      <section className="bg-gradient-to-br from-violet-50 via-fuchsia-50 to-indigo-50 py-16 dark:from-slate-900/40 dark:via-slate-900/40 dark:to-slate-900/40">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Eligibility"
              title="Who Can Apply for the Course?"
              subtitle="Open to a wide range of backgrounds — find your path in."
              accent="text-fuchsia-600"
            />
            <ol className="space-y-4">
              {whoCanApply.map((point, idx) => (
                <li
                  key={idx}
                  className="flex gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-800/50"
                >
                  <span
                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow ${moduleColors[idx % moduleColors.length]}`}
                  >
                    {idx + 1}
                  </span>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{point}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex flex-col justify-center gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white shadow-lg">
              <h3 className="mb-1 font-bold">Globally Recognised Certification</h3>
              <p className="text-sm text-white/90">
                Earn a certificate trusted by employers worldwide and accelerate your career.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { tag: "Graduates", color: "from-blue-500 to-indigo-500" },
                { tag: "Working Professionals", color: "from-emerald-500 to-teal-500" },
                { tag: "Career Switchers", color: "from-rose-500 to-pink-500" },
                { tag: "Fresh Learners", color: "from-violet-500 to-fuchsia-500" },
              ].map((item) => (
                <span
                  key={item.tag}
                  className={`rounded-full bg-gradient-to-r px-4 py-1.5 text-xs font-semibold text-white shadow ${item.color}`}
                >
                  {item.tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- CURRICULUM (Accordion) ---------------- */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Education For Everyone"
          title={`${course.title} Course Curriculum`}
        />
        <div className="space-y-3">
          {curriculum.map((module, idx) => (
            <AccordionItem
              key={idx}
              item={module}
              isOpen={openModule === idx}
              onToggle={() => setOpenModule(openModule === idx ? -1 : idx)}
              color={moduleColors[idx % moduleColors.length]}
            />
          ))}
        </div>
      </section>

      {/* ---------------- CAPSTONE PROJECTS ---------------- */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16 dark:from-slate-900/40 dark:to-slate-950">
        <div className="container-page">
          <SectionHeading
            eyebrow="Build & Showcase"
            title="Capstone Projects"
            subtitle="Hands-on projects covering the full learning lifecycle."
            accent="text-teal-600"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capstoneProjects.map((project, idx) => {
              const color = project.color || moduleColors[idx % moduleColors.length];
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5 dark:bg-slate-800"
                >
                  <div className={`h-1.5 w-full bg-gradient-to-r ${color}`} />
                  <div className="p-6">
                    {project.tag && (
                      <p className={`mb-2 inline-block rounded-full bg-gradient-to-r ${color} px-3 py-1 text-xs font-bold text-white`}>
                        {project.tag}
                      </p>
                    )}
                    <h3 className="font-bold text-slate-900 dark:text-white">{project.title}</h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{project.desc}</p>
                    {project.stack?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.stack.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------- CAREER OPPORTUNITIES ---------------- */}
      <section className="container-page py-16">
        <SectionHeading
          eyebrow="Career Opportunities"
          title="Unlock Your Potential — What Can You Become?"
          subtitle={`Master ${course.title} to build a career that matters.`}
          accent="text-rose-600"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {careerRoles.map((role) => (
            <div
              key={role.name}
              className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5 dark:bg-slate-800/50"
            >
              <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${role.color} text-white`}>
                <HiCheckCircle className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{role.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- CERTIFICATION / REGISTER CTA ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 py-16">
        <div className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

        <div className="container-page relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div className="rounded-2xl bg-white/95 p-8 text-center shadow-xl backdrop-blur dark:bg-slate-900/90">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md">
              <HiOutlineAcademicCap className="h-7 w-7" />
            </span>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              Certificate of Completion
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Awarded on successfully finishing <strong>{course.title}</strong>, conducted by American FutureTech.
            </p>
          </div>

          <div className="text-center text-white lg:text-left">
            <h2 className="text-2xl font-extrabold sm:text-3xl">Register Now</h2>
            <p className="mt-3 text-white/90">
              Seats are limited — enroll today and start building job-ready skills in {categoryName.toLowerCase()}.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <button
  onClick={() => handleEnroll("registration")}
  disabled={enrollStatus === "loading"}
  className="rounded-lg bg-white px-6 py-2.5 font-semibold text-indigo-700 shadow-md transition-transform hover:-translate-y-0.5 disabled:opacity-60"
>
  {enrollStatus === "loading"
    ? "Enrolling..."
    : `Enroll Now — ${formatCurrencyUSD(course.instructorId)}`}
</button>
              <Link
                to="/contact"
                className="rounded-lg border-2 border-white/70 px-6 py-2.5 font-semibold text-white hover:bg-white/10"
              >
                Talk to an Advisor
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default CourseDetails;