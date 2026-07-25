import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import CTA from "../components/CTA";

const PARTNER_LOGOS = [
  { name: "University", src: "/assets/logos/university.svg" },
  { name: "Aircrack-ng", src: "/assets/logos/aircrack-ng.svg" },
  { name: "Accenture", src: "/assets/logos/accenture.svg" },
  { name: "Apple", src: "/assets/logos/apple.svg" },
  { name: "Wipro", src: "/assets/logos/wipro.svg" },
  { name: "IBM", src: "/assets/logos/ibm.svg" },
];

const WHY_CHOOSE = [
  {
    icon: "🎓",
    title: "High Quality Courses",
    desc: "Our courses are carefully designed by industry experts to provide practical knowledge, hands-on experience, and real-world skills that help you stay ahead in today's competitive market.",
  },
  {
    icon: "♾️",
    title: "Life Time Access",
    desc: "Enjoy unlimited access to course materials anytime, anywhere. Learn at your own pace and revisit lessons whenever you need a refresher.",
  },
  {
    icon: "👨‍🏫",
    title: "Expert Instructors",
    desc: "Learn from experienced professionals who bring real industry insights, mentorship, and guidance to help you achieve your career goals.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The Data Science program was incredibly well-structured. The hands-on projects helped me build a strong portfolio and boosted my confidence.",
    name: "David Owens",
    role: "Designer",
    rating: 5,
  },
  {
    quote:
      "I appreciated the flexibility of the classes. Being able to access the course anytime made it easy to balance learning with my full-time job.",
    name: "Bob Limones",
    role: "Student",
    rating: 5,
  },
  {
    quote:
      "The cybersecurity course covered everything from basics to advanced concepts. The instructors were knowledgeable and very supportive.",
    name: "Tom Hurley",
    role: "Content Creator",
    rating: 4,
  },
];

const STATS = [
  { icon: "🧑‍🤝‍🧑", value: "10.2K+", label: "Student Enrolled" },
  { icon: "📘", value: "2.5K+", label: "Class Completed" },
  { icon: "👍", value: "100%", label: "Satisfaction Rate" },
  { icon: "🧑‍💼", value: "30+", label: "Top Mentors" },
];

const FEATURES = ["Flexible Classes", "Online Class Mode", "Educator Support"];

const StarRating = ({ count }) => (
  <div className="flex gap-0.5 text-amber-400 text-sm mb-2" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i}>{i < count ? "★" : "☆"}</span>
    ))}
  </div>
);

const About = () => (
  <>
    <Helmet>
      <title>About Us | American FutureTech</title>
    </Helmet>
    <PageHeader title="About Us" breadcrumbItems={[{ label: "About Us" }]} />

    {/* Hero */}
    <section className="container-page py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            About Us
          </span>
          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">
            We Providing The{" "}
            <span className="text-primary">Best Quality</span> Online
            Courses.
          </h1>

          <p className="mt-5 text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>American FutureTech LLC</strong> is a US-registered
            Limited Liability Company based in Wyoming, dedicated to
            providing high-quality technology training and professional
            development programs. Our mission is to equip individuals and
            organizations with practical skills for today's digital economy.
          </p>

          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
            Our vision is to create a global network of skilled professionals
            capable of solving real-world technology challenges. We
            specialize in courses designed for both beginners and seasoned
            professionals.
          </p>

          <ul className="mt-6 space-y-3">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 font-medium text-slate-800 dark:text-slate-100"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Visual */}
        <div className="relative flex justify-center">
          <div className="relative w-72 sm:w-80">
            <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full border-4 border-amber-400" />
            <div className="h-80 w-full rounded-3xl bg-primary/90 shadow-xl" />
            <div className="absolute top-6 -right-6 h-32 w-24 rounded-2xl bg-amber-400 shadow-lg flex items-start justify-center pt-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl">
                👤
              </span>
            </div>
            <div className="absolute -bottom-6 right-2 rounded-2xl bg-white dark:bg-slate-800 px-5 py-3 shadow-xl text-center">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                10K+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Students
                <br />
                Enrolled
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Trusted by / partner logos */}
    <section className="border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 py-10">
      <div className="container-page">
        <p className="text-center text-xs font-semibold tracking-widest text-slate-400 uppercase mb-8">
          Trusted by professionals from
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-80">
          {PARTNER_LOGOS.map((logo) => (
            <div key={logo.name} className="flex justify-center">
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Why choose us */}
    <section className="container-page py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          Why Choose American FutureTech LLC
        </span>
        <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          The Best <span className="text-primary">Beneficial</span> Side of
          Edtech
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WHY_CHOOSE.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              {item.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>

    {/* Testimonials */}
    <section className="bg-slate-50 dark:bg-slate-900/40 py-16">
      <div className="container-page">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            Testimonials
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            What Our Students Have To Say
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            We take pride in the success and satisfaction of our students.
            Hear directly from them about their learning experience, career
            growth, and how our programs have helped them achieve their
            goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <span className="text-3xl text-primary/20 font-serif leading-none">
                "
              </span>
              <StarRating count={t.rating} />
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            View All <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="container-page py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-sm"
          >
            <div className="mx-auto mb-3 text-2xl">{s.icon}</div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {s.value}
            </p>
            <p className="mt-1 text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400 uppercase">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>

    <CTA />
  </>
);

export default About;