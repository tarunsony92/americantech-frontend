import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  HiOutlineClock,
  HiOutlineAcademicCap,
  HiOutlineCheckCircle,
  HiStar,
  HiCheckCircle,
  HiChevronDown,
  HiOutlineBriefcase,
  HiOutlineGlobeAlt,
  HiOutlineShieldCheck,
  HiOutlineDesktopComputer,
  HiSparkles,
  HiOutlineBadgeCheck,
  HiOutlineSparkles,
  HiOutlineArrowRight,
  HiOutlineMail,
} from "react-icons/hi";
import PageHeader from "../components/PageHeader";
import CTA from "../components/CTA";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import useResourceItem from "../hooks/useResourceItem";
import { formatCurrencyUSD } from "../utils/format";

/* =========================================================
   GENERIC FALLBACKS
   ---------------------------------------------------------
   These are used ONLY when a course has nothing set in the
   database for that field. All real content should now come
   from the database (admin panel), not from hardcoded files.
========================================================= */

const DEFAULT_CERTIFICATE_IMAGES = {
  completionImage: "/static/images/dsai.jpeg",
  microsoftImage: "/static/images/microsoftcertificate.jpg",
};

const DEFAULT_TOOLS = [
  "Python", "Kali Linux", "Nmap", "Metasploit", "Wireshark", "Burp Suite", "Nessus", "Hashcat",
];

 
const DEFAULT_CURRICULUM = [
  { title: "Module 1: Foundations & Core Concepts", desc: ["Build the base knowledge you'll rely on through the rest of the program."] },
  { title: "Module 2: Core Tools & Environment Setup", desc: ["Get hands-on with the primary tools and workflows used in the field."] },
  { title: "Module 3: Hands-On Project Sprint 1", desc: ["Apply what you've learned to a guided, real-world style project."] },
  { title: "Module 4: Advanced Topics & Techniques", desc: ["Go deeper into advanced concepts and industry-standard practices."] },
  { title: "Module 5: Hands-On Project Sprint 2", desc: ["A second project sprint to reinforce and extend your skills."] },
  { title: "Module 6: Capstone Project", desc: ["Bring everything together in a portfolio-ready capstone build."] },
  { title: "Module 7: Interview Preparation & Mock Interviews", desc: ["Resume building, mock interviews and career guidance to help you land the role."] },
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

const AccordionItem = ({ item, isOpen, onToggle, color }) => {
  const points = Array.isArray(item.desc)
    ? item.desc
    : item.desc
    ? [item.desc]
    : [];
 
  return (
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
      {isOpen && points.length > 0 && (
        <ul className="space-y-2 border-t border-slate-100 px-5 py-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">
          {points.map((pt, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-current opacity-60" />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
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

  // ---- Resolve content: DB data (admin panel) > generic fallback defaults ----
  const tools = course.tools?.length ? course.tools : DEFAULT_TOOLS;
  const curriculum = course.curriculum?.length ? course.curriculum : DEFAULT_CURRICULUM;
  const capstoneProjects = course.capstoneProjects?.length ? course.capstoneProjects : DEFAULT_CAPSTONE_PROJECTS;
  const whoCanApply = course.eligibility?.length ? course.eligibility : DEFAULT_WHO_CAN_APPLY;

  const rawCareerRoles = course.careerRoles?.length
    ? course.careerRoles
    : DEFAULT_CAREER_ROLE_COLORS.map((r) => r.name);

  const careerRoles = rawCareerRoles.map((r, i) => ({
    name: r,
    color: DEFAULT_CAREER_ROLE_COLORS[i % DEFAULT_CAREER_ROLE_COLORS.length].color,
  }));

  // ---- Certificate images for this specific course (from DB, with fallback) ----
  const certificateImages = {
    completionImage: course.completionCertificateImage || DEFAULT_CERTIFICATE_IMAGES.completionImage,
    microsoftImage: course.microsoftCertificateImage || DEFAULT_CERTIFICATE_IMAGES.microsoftImage,
  };

  const moduleColors = ["from-indigo-500 to-blue-500", "from-violet-500 to-fuchsia-500", "from-emerald-500 to-teal-500", "from-amber-500 to-orange-500", "from-rose-500 to-pink-500", "from-cyan-500 to-sky-500", "from-purple-500 to-indigo-500"];

  return (
    <>
      <Helmet><title>{course.title} | American FutureTech</title></Helmet>
      <PageHeader
        title={course.title}
        breadcrumbItems={[{ label: "Courses", to: "/courses" }, { label: course.title }]}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/80 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gradient-to-br from-fuchsia-400/20 via-indigo-400/20 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gradient-to-tr from-emerald-400/15 via-cyan-400/15 to-transparent blur-3xl" />

        <div className="container-page relative grid grid-cols-1 gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-10">

          <div className="min-w-0">

            {course.image && (
              <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white shadow-xl ring-1 ring-slate-900/5 dark:border-white/10 dark:bg-slate-900">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] sm:h-80 lg:h-[380px]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                  <h1 className="mt-3 max-w-3xl text-2xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-3xl lg:text-4xl">
                    {course.title}
                  </h1>
                </div>
              </div>
            )}

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
                  value: course.certification ? "Yes" : "Microsoft Certificate",
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

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-[1px] shadow-2xl">
              <div className="rounded-[23px] bg-white p-5 dark:bg-slate-900 sm:p-6">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Course Fee
                  </p>
                  <p className="mt-1 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                    {formatCurrencyUSD(course.price)}
                  </p>
                </div>

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
                    {enrollStatus === "loading" ? "Enrolling..." : "Enroll Now"}
                  </button>
                )}

                {enrollError && (
                  <p className="mt-2 text-center text-xs font-medium text-red-500">
                    {enrollError}
                  </p>
                )}

                <Link
                  to="/contact"
                  className="mt-3 block w-full rounded-xl border-2 border-indigo-200 py-3 text-center font-semibold text-indigo-700 transition-all duration-300 hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-950"
                >
                  Talk to an Advisor
                </Link>

                <div className="my-5 h-px bg-slate-200 dark:bg-white/10" />

                <dl className="space-y-3.5 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500 dark:text-slate-400">Duration</dt>
                    <dd className="text-right font-semibold text-slate-900 dark:text-white">{course.duration}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500 dark:text-slate-400">Level</dt>
                    <dd className="text-right font-semibold text-slate-900 dark:text-white">{course.level}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-slate-500 dark:text-slate-400">Format</dt>
                    <dd className="text-right font-semibold text-slate-900 dark:text-white">Online</dd>
                  </div>
                </dl>

                <div className="mt-5 rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/70">
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Secure enrollment • Expert-led learning
                  </p>
                </div>
              </div>
            </div>

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
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700 py-16 sm:py-20 lg:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-fuchsia-400/20 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400/10 blur-3xl" />
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="container-page relative">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">

            <div className="relative">

              <div className="mb-8 max-w-xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
                  <HiOutlineSparkles className="h-3.5 w-3.5" />
                  Earn Recognized Certificates
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  Learn. Complete.{" "}
                  <span className="text-white/80">Get Certified.</span>
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-white/75 sm:text-base">
                  Successfully complete the program and showcase your achievement
                  with certificates from recognized organizations.
                </p>
              </div>

              <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2">

                <div className="group relative">
                  <div className="absolute -top-3 left-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Course Completion
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-white/30 bg-white shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)] dark:bg-slate-900">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={certificateImages.completionImage}
                        alt="American FutureTech Certificate of Completion"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
                      <div className="absolute bottom-3 left-3 rounded-lg border border-white/30 bg-black/45 px-3 py-2 text-white shadow-lg backdrop-blur-md">
                        <p className="text-[9px] font-medium uppercase tracking-wider text-white/70">Issued by</p>
                        <p className="text-xs font-bold">American FutureTech</p>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            Certificate of Completion
                          </h3>
                          <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                            Awarded to learners who successfully complete <strong>{course.title}</strong>.
                          </p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                            <path d="M20 6L9 17l-5-5" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Successfully Completed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="group relative ">
                  <div className="absolute -top-3 left-5 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-700 shadow-lg">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                    Microsoft Certificate
                  </div>

                  <div className="relative overflow-hidden rounded-2xl border border-white/30 bg-white shadow-2xl transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.25)] dark:bg-slate-900">
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={certificateImages.microsoftImage}
                        alt="Microsoft Certificate of Excellence"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-white/30 bg-black/45 px-3 py-2 text-white shadow-lg backdrop-blur-md">
                        <div className="grid grid-cols-2 gap-[2px]">
                          <span className="h-2 w-2 bg-red-500" />
                          <span className="h-2 w-2 bg-green-500" />
                          <span className="h-2 w-2 bg-blue-500" />
                          <span className="h-2 w-2 bg-yellow-500" />
                        </div>
                        <div>
                          <p className="text-[9px] font-medium uppercase tracking-wider text-white/70">Issued by</p>
                          <p className="text-xs font-bold">Microsoft</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                            Microsoft Certificate
                          </h3>
                          <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">
                            Earn an additional certificate from <strong>Microsoft</strong> upon meeting the program's
                            required criteria.
                          </p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                            <path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" />
                          </svg>
                        </div>
                      </div>
                      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                          Microsoft Issued
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70 sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <HiOutlineCheckCircle className="h-4 w-4 text-emerald-300" />
                  Completion Recognition
                </span>
                <span className="hidden h-1 w-1 rounded-full bg-white/30 sm:block" />
                <span className="flex items-center gap-1.5">
                  <HiOutlineCheckCircle className="h-4 w-4 text-blue-300" />
                  Microsoft Certification
                </span>
              </div>
            </div>

            <div className="relative">
  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-7 shadow-2xl backdrop-blur-xl sm:p-9">
    <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-teal-400/10 blur-2xl" />
    <div className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-indigo-500/10 blur-2xl" />

    <div className="relative inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-teal-300 backdrop-blur-md">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-300 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-400" />
      </span>
      Limited Seats Available
    </div>

    <h2 className="relative mt-5 text-5xl font-black tracking-tight text-white sm:text-4xl">
      Register Now
    </h2>

    <p className="relative mt-4 text-sm leading-6 text-slate-300 sm:text-base">
      Secure your place in the program, learn from experienced mentors,
      and earn certificates that showcase your achievement.
    </p>

    <div className="relative mt-6 space-y-3">
      <div className="flex items-center gap-3 text-sm text-slate-200">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-400/10">
          <HiOutlineCheckCircle className="h-4 w-4 text-teal-300" />
        </span>
        Complete the course successfully
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-200">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-400/10">
          <HiOutlineCheckCircle className="h-4 w-4 text-teal-300" />
        </span>
        Receive your completion certificate
      </div>
      <div className="flex items-center gap-3 text-sm text-slate-200">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-400/10">
          <HiOutlineCheckCircle className="h-4 w-4 text-teal-300" />
        </span>
        Eligible learners receive Microsoft certification
      </div>
    </div>

    <div className="relative mt-8 flex w-full flex-row gap-3">
      <button
        onClick={() => handleEnroll("registration")}
        disabled={enrollStatus === "loading"}
        className="group inline-flex min-h-[52px] w-1/2 flex-1 items-center justify-center gap-2 rounded-xl bg-teal-400 px-6 py-3 text-2xl font-extrabold text-slate-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-teal-300 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
      >
        {enrollStatus === "loading" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900/30 border-t-slate-900" />
            Enrolling...
          </>
        ) : (
          <>
            Register Now
            <span className="rounded-md bg-slate-900/10 px-2.5 py-1 text-xl">
              {formatCurrencyUSD(course.instructorId)}
            </span>
            <HiOutlineArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </div>

    <div className="relative mt-3 flex w-full flex-row gap-3">
      <Link
        to="/contact"
        className="inline-flex min-h-[52px] w-1/2 flex-1 items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white/10"
      >
        Talk to an Advisor
      </Link>
    </div>

    <div className="relative mt-6 flex gap-3 rounded-xl border border-white/10 bg-black/20 p-3.5">
      <HiOutlineMail className="mt-0.5 h-5 w-5 shrink-0 text-teal-300/80" />
      <p className="text-xs leading-5 text-slate-400">
        <strong className="text-white">After registration:</strong>{" "}
        you'll receive a confirmation email with the next steps and
        program instructions.
      </p>
    </div>

    <div className="relative mt-5 flex items-center justify-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 018 0v3" />
      </svg>
      Secure Registration
    </div>
  </div>
</div>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
};

export default CourseDetails;