import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { HiOutlineClock, HiOutlineAcademicCap, HiStar, HiCheckCircle } from "react-icons/hi";
import PageHeader from "../components/PageHeader";
import CTA from "../components/CTA";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import useResourceItem from "../hooks/useResourceItem";
import { formatCurrencyINR } from "../utils/format";

const CURRICULUM = [
  "Foundations & core concepts", "Hands-on project sprint 1", "Advanced topics & tooling",
  "Hands-on project sprint 2", "Capstone project", "Interview preparation & mock interviews",
];

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { item: course, loading, error } = useResourceItem(courseService, id);
  const [enrollStatus, setEnrollStatus] = useState("idle"); // idle | loading | success | error
  const [enrollError, setEnrollError] = useState(null);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      // Send them to register, then bounce straight back here to finish enrolling once logged in.
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

  if (loading) {
    return <div className="container-page py-24 text-center text-slate-500">Loading course...</div>;
  }

  if (error || !course) {
    return <div className="container-page py-24 text-center text-red-500">{error || "Course not found."}</div>;
  }

  return (
    <>
      <Helmet><title>{course.title} | American FutureTech</title></Helmet>
      <PageHeader
        title={course.title}
        subtitle={course.category?.name}
        breadcrumbItems={[{ label: "Courses", to: "/courses" }, { label: course.title }]}
      />

      <section className="container-page grid grid-cols-1 gap-10 py-12 lg:grid-cols-[1fr_360px]">
        <div>
          {course.image && <img src={course.image} alt={course.title} className="h-72 w-full rounded-2xl object-cover" />}

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1"><HiOutlineClock className="h-4 w-4" /> {course.duration}</span>
            <span className="flex items-center gap-1"><HiOutlineAcademicCap className="h-4 w-4" /> {course.level}</span>
            {course.rating && <span className="flex items-center gap-1"><HiStar className="h-4 w-4 text-amber-400" /> {course.rating} rating</span>}
            {course.instructor && <span>Instructor: {course.instructor.fullName}</span>}
          </div>

          <h2 className="section-title mt-8">Overview</h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            {course.description ||
              `This program takes you from fundamentals to job-ready skills in ${(course.category?.name || "this field").toLowerCase()}, combining live instruction, hands-on projects, and mentor feedback across ${(course.duration || "the program").toLowerCase()}.`}
          </p>

          <h2 className="section-title mt-10">Curriculum</h2>
          <ul className="mt-4 space-y-3">
            {CURRICULUM.map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <HiCheckCircle className="h-5 w-5 flex-shrink-0 text-primary-600" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="card h-fit p-6">
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{formatCurrencyINR(course.price)}</p>

          {enrollStatus === "success" ? (
            <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              You're enrolled! Check your dashboard for course access.
            </p>
          ) : (
            <button onClick={handleEnroll} disabled={enrollStatus === "loading"} className="btn-primary mt-5 w-full">
              {enrollStatus === "loading" ? "Enrolling..." : "Enroll Now"}
            </button>
          )}
          {enrollError && <p className="mt-2 text-center text-xs text-red-500">{enrollError}</p>}

          <Link to="/contact" className="btn-outline mt-3 w-full">Talk to an Advisor</Link>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Duration</dt><dd className="font-medium">{course.duration}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Level</dt><dd className="font-medium">{course.level}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Category</dt><dd className="font-medium">{course.category?.name}</dd></div>
          </dl>
        </aside>
      </section>

      <CTA />
    </>
  );
};

export default CourseDetails;
