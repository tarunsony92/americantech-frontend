import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { HiOutlineClock, HiOutlineAcademicCap, HiStar, HiArrowRight } from "react-icons/hi";
import PageHeader from "../components/PageHeader";
import CTA from "../components/CTA";
import { courses } from "../data/courses";
import { formatCurrencyINR } from "../utils/format";

const LEVEL_STYLES = {
  Beginner: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  Intermediate: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  Advanced: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
};

const Courses = () => {
  return (
    <>
      <Helmet><title>Courses | American FutureTech</title></Helmet>
      <PageHeader
        title="Explore Our Courses"
        subtitle="Three career-focused programs in cyber security and data science, built around live instruction, real tools, and a portfolio of capstone projects."
        breadcrumbItems={[{ label: "Courses" }]}
      />

      <section className="container-page py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="card group flex flex-col overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${LEVEL_STYLES[course.level]}`}>
                  {course.level}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{course.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-300">{course.tagline}</p>

                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><HiOutlineClock className="h-4 w-4" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><HiOutlineAcademicCap className="h-4 w-4" /> {course.tools.length}+ tools</span>
                  <span className="flex items-center gap-1"><HiStar className="h-4 w-4 text-amber-400" /> {course.rating}</span>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                  <span className="text-xl font-bold text-slate-900 dark:text-white">{formatCurrencyINR(course.price)}</span>
                  <span className="flex items-center gap-1 text-sm font-medium text-primary-600 transition group-hover:gap-2">
                    View details <HiArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <CTA />
    </>
  );
};

export default Courses;