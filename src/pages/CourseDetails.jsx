import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { HiOutlineClock, HiOutlineAcademicCap, HiStar, HiCheckCircle } from "react-icons/hi";
import PageHeader from "../components/PageHeader";
import CTA from "../components/CTA";
import enrollmentService from "../services/enrollmentService";
import { getCourseById, courses } from "../data/courses";
import { formatCurrencyINR } from "../utils/format";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const course = getCourseById(id);
  const [enrollStatus, setEnrollStatus] = useState("idle"); // idle | loading | success | error
  const [enrollError, setEnrollError] = useState(null);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/register", { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }
    setEnrollStatus("loading");
    setEnrollError(null);
    try {
      await enrollmentService.enrollSelf(id);
      setEnrollStatus("success");
    } catch (err) {
      setEnrollError(err.response?.data?.message || "Couldn't enroll. Please try again.");
      setEnrollStatus("error");
    }
  };

  if (!course) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-red-500">Course not found.</p>
        <Link to="/courses" className="btn-outline mt-4 inline-block">Back to courses</Link>
      </div>
    );
  }

  const related = courses.filter((c) => c.id !== course.id);

  return (
    <>
      <Helmet><title>{course.title} | American FutureTech</title></Helmet>
      <PageHeader
        title={course.title}
        subtitle={course.tagline}
        breadcrumbItems={[{ label: "Courses", to: "/courses" }, { label: course.title }]}
      />

      <section className="container-page grid grid-cols-1 gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div>
          <img src={course.image} alt={course.title} className="h-72 w-full rounded-2xl object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1"><HiOutlineClock className="h-4 w-4" /> {course.duration}</span>
            <span className="flex items-center gap-1"><HiOutlineAcademicCap className="h-4 w-4" /> {course.level}</span>
            <span className="flex items-center gap-1"><HiStar className="h-4 w-4 text-amber-400" /> {course.rating} rating</span>
          </div>

          <h2 className="section-title mt-8">Overview</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">{course.tagline} The program combines live instruction, hands-on labs, and mentor feedback across {course.duration}.</p>

          <h2 className="section-title mt-10">Tools & technologies</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {course.tools.map((tool) => (
              <span key={tool} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {tool}
              </span>
            ))}
          </div>

          <h2 className="section-title mt-10">Curriculum</h2>
          <ul className="mt-4 space-y-3">
            {course.curriculum.map((item, i) => (
              <li key={item} className="flex items-start gap-3 text-slate-700 dark:text-slate-200">
                <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-600 dark:bg-primary-950">
                  {i + 1}
                </span>
                <span>Module {i + 1}: {item}</span>
              </li>
            ))}
          </ul>

          <h2 className="section-title mt-10">What you can become</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2">
            {course.outcomes.map((role) => (
              <div key={role} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
                <HiCheckCircle className="h-4 w-4 flex-shrink-0 text-primary-600" /> {role}
              </div>
            ))}
          </div>
        </div>

        <aside className="card h-fit p-6">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrencyINR(course.price)}</p>

          {enrollStatus === "success" ? (
            <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              You're enrolled! Check your dashboard for course access.
            </p>
          ) : (
            <button onClick={handleEnroll} disabled={enrollStatus === "loading"} className="btn-primary mt-5 w-full">
              {enrollStatus === "loading" ? "Enrolling..." : "Enroll now"}
            </button>
          )}
          {enrollError && <p className="mt-2 text-center text-xs text-red-500">{enrollError}</p>}

          <Link to="/contact" className="btn-outline mt-3 w-full">Talk to an advisor</Link>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Duration</dt><dd className="font-medium">{course.duration}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Level</dt><dd className="font-medium">{course.level}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Tools covered</dt><dd className="font-medium">{course.tools.length}+</dd></div>
          </dl>

          {related.length > 0 && (
            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
              <p className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Other programs</p>
              <div className="space-y-3">
                {related.map((c) => (
                  <Link key={c.id} to={`/courses/${c.id}`} className="block text-sm text-slate-600 hover:text-primary-600 dark:text-slate-300">
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>

      <CTA />
    </>
  );
};

export default CourseDetails;