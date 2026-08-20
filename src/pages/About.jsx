import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import CTA from "../components/CTA";

const PARTNER_LOGOS = [
  { name: "Accenture", src: "/static/images/accenturre.png" },
  { name: "IBM", src: "/static/images/ibm.png" },
  { name: "Microsoft", src: "/static/images/microsoft.jpg" },
  { name: "Wipro", src: "/static/images/wipo.png" },
  { name: "Infosys", src: "/static/images/infosys.png" },
];

const WHY_CHOOSE = [
  {
    icon: "🎓",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
    title: "High Quality Courses",
    desc: "Our courses are carefully designed by industry experts to provide practical knowledge, hands-on experience, and real-world skills that help you stay ahead in today's competitive market.",
  },
  {
    icon: "♾️",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    title: "Life Time Access",
    desc: "Enjoy unlimited access to course materials anytime, anywhere. Learn at your own pace and revisit lessons whenever you need a refresher.",
  },
  {
    icon: "👨‍🏫",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=600&q=80",
    title: "Expert Instructors",
    desc: "Learn from experienced professionals who bring real industry insights, mentorship, and guidance to help you achieve your career goals.",
  },
];

const TESTIMONIALS = [
  {
    image: "/assets/testimonials/student1.jpg",
    quote:
      "The Data Science program was incredibly well-structured. The hands-on projects helped me build a strong portfolio and boosted my confidence.",
    name: "David Owens",
    role: "Designer",
    rating: 5,
  },
  {
    image: "/assets/testimonials/student2.jpg",
    quote:
      "I appreciated the flexibility of the classes. Being able to access the course anytime made it easy to balance learning with my full-time job.",
    name: "Bob Limones",
    role: "Student",
    rating: 5,
  },
  {
    image: "/assets/testimonials/student3.jpg",
    quote:
      "The cybersecurity course covered everything from basics to advanced concepts. The instructors were knowledgeable and very supportive.",
    name: "Tom Hurley",
    role: "Content Creator",
    rating: 4,
  },
];

const STATS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    value: "1.2K+",
    label: "Student Enrolled",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    value: "2.5K+",
    label: "Class Completed",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    color: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    ),
    value: "98%",
    label: "Satisfaction Rate",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    value: "30+",
    label: "Top Mentors",
    bg: "bg-violet-50 dark:bg-violet-500/10",
    color: "text-violet-600 dark:text-violet-400",
  },
];
const FEATURES = [
  "Flexible Classes",
  "Online Class Mode",
  "Educator Support",
];

const StarRating = ({ count }) => (
  <div
    className="flex gap-0.5 text-amber-400 text-sm mb-2"
    aria-label={`${count} out of 5 stars`}
  >
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

    <PageHeader
      title="About Us"
      breadcrumbItems={[{ label: "About Us" }]}
    />

    {/* Hero */}
    <section className="container-page py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

        {/* Left Content */}
        <div>
          <span className="text-xs font-semibold tracking-widest text-primary uppercase">
            About Us
          </span>

          <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold leading-tight text-slate-900 dark:text-white">
            We Providing The{" "}
            <span className="text-primary">Best Quality</span> Online Courses.
          </h1>

          <p className="mt-5 text-justify leading-relaxed text-slate-600 dark:text-slate-300">
  <strong>American FutureTech LLC</strong> is a US-registered Limited
  Liability Company based in Wyoming, dedicated to providing
  high-quality technology training and professional development
  programs. Our mission is to equip individuals and organizations
  with practical skills for today's digital economy.
</p>

<p className="mt-4 text-justify leading-relaxed text-slate-600 dark:text-slate-300">
  Our vision is to create a global network of skilled professionals
  capable of solving real-world technology challenges. We specialize
  in courses designed for both beginners and seasoned professionals.
</p>

          <ul className="mt-6 space-y-3">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-3 font-medium text-slate-800 dark:text-slate-100"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

{/* Hero Image */}
        <div className="relative flex justify-center">
          <div className="relative w-72 sm:w-80">

            {/* Decorative background blob */}
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/10 to-amber-400/10 -z-10"></div>

            <div className="absolute -top-3 -left-3 h-8 w-8 rounded-full border-4 border-amber-400 bg-white dark:bg-slate-900"></div>
            <div className="absolute -bottom-3 -left-6 h-4 w-4 rounded-full bg-primary/40"></div>

            <img
              src="/static/images/about/about-hero.png"
              alt="Students learning"
              className="h-80 w-full rounded-3xl object-cover shadow-2xl ring-1 ring-black/5"
            />

            <div className="absolute top-6 -right-6 flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-2xl bg-amber-400 shadow-xl ring-4 ring-white dark:ring-slate-900 rotate-6 hover:rotate-0 transition-transform duration-300">
              <span className="text-2xl leading-none">🎓</span>
              <span className="text-[10px] font-bold uppercase tracking-wide text-slate-900">
                Certified
              </span>
            </div>

            <div className="absolute -bottom-6 right-4 rounded-2xl bg-white dark:bg-slate-800 px-6 py-4 shadow-2xl text-center ring-1 ring-black/5">
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none">
                10K+
              </p>

              <p className="mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                Students
                <br />
                Enrolled
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>

{/* Trusted by / Partner Logos */}
<section className="border-y border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 py-14">
  <div className="container-page">
    <p className="text-center text-xs font-semibold tracking-widest text-slate-400 uppercase mb-10">
      Trusted by professionals from
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-10 gap-y-8 items-center justify-items-center">
      {PARTNER_LOGOS.map((logo) => (
        <div
          key={logo.name}
          className="flex items-center justify-center"
        >
          <img
            src={logo.src}
            alt={logo.name}
            className="h-full w-full max-w-[110px] object-contain"
          />
        </div>
      ))}
    </div>
  </div>
</section>

    {/* Why Choose Us */}
    <section className="container-page py-16">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          Why Choose American FutureTech LLC
        </span>

        <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          The Best <span className="text-primary">Beneficial</span> Side of
          EdTech
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
  {WHY_CHOOSE.map((item) => (
    <div
      key={item.title}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900"
    >
      <img
        src={item.image}
        alt={item.title}
        className="h-48 w-full object-cover"
      />

      <div className="p-8 text-center">
        {/* <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
          {item.icon}
        </div> */}

        <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
          {item.title}
        </h3>

        <p className="text-justify text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {item.desc}
        </p>
      </div>
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
            Hear directly from them about their learning experience,
            career growth, and how our programs have helped them
            achieve their goals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >

              <StarRating count={t.rating} />

              <p className="text-sm text-slate-600 dark:text-slate-300 text-justify leading-relaxed mb-6">
                {t.quote}
              </p>

              <div className="flex items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
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
          
           <a href="#"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
          >
            View All →
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
            className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
          >
            <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${s.bg} ${s.color} transition-transform duration-300 group-hover:scale-110`}>
              {s.icon}
            </div>

            <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {s.value}
            </p>

            <p className="mt-2 text-sm font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
    {/* Call To Action */}
    <CTA />
  </>
);

export default About;