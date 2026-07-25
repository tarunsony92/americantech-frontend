import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Star,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import CourseCard from "../components/CourseCard";
import CTA from "../components/CTA";
import courseService from "../services/courseService";
import useResourceList from "../hooks/useResourceList";
import { formatCurrencyINR } from "../utils/format";

/* ---------------- Static content (from site copy) ---------------- */

const MARQUEE_ITEMS = [
  "Cyber Security With AI",
  "Agentic AI",
  "Generative AI",
  "Data Science",
];

const WHY_CHOOSE = [
  {
    icon: "🖥️",
    title: "Microsoft Certificate",
    desc: "American FutureTech LLC collaboration with Microsoft — get industry-recognised credentials.",
  },
  {
    icon: "🧑‍🤝‍🧑",
    title: "Industry Connections",
    desc: "Access our network of 200+ industry hiring partners and unlock real career opportunities.",
  },
  {
    icon: "✅",
    title: "Career Acceleration",
    desc: "Our mentees see 3x faster career growth compared to traditional learning paths.",
  },
  {
    icon: "👥",
    title: "1-on-1 Sessions",
    desc: "Regular private sessions with your dedicated mentor for fully personalised support.",
  },
];

const STATS = [
  { value: 10200, suffix: "+", label: "Students Trained" },
  { value: 200, suffix: "+", label: "Hiring Partners" },
  { value: 3, suffix: "x", label: "Faster Career Growth" },
  { value: 98, suffix: "%", label: "Satisfaction Rate" },
];

const PARTNER_LOGOS = [
  "Microsoft",
  "IBM",
  "Cisco",
  "JPMorganChase",
  "Bank of America",
  "HSBC",
];

const CERTIFICATES = [
  {
    provider: "Microsoft",
    title: "Advanced Generative AI Professional Certificate",
    date: "Feb 2, 2024",
    tier: "FUNDAMENTALS",
  },
  {
    provider: "Microsoft",
    title: "Data Science Professional Certificate",
    date: "Jun 23, 2023",
    tier: "FUNDAMENTALS",
  },
  {
    provider: "Microsoft",
    title: "Cyber Security with AI Professional Certificate",
    date: "Oct 29, 2022",
    tier: "EXPERT",
  },
];

const PROGRAM_FEATURES = [
  {
    tag: "HANDS-ON LEARNING",
    title: "Industry-Ready Tech Curriculum",
    desc: "Learn by building real projects with tools used by top companies — from day one.",
  },
  {
    tag: "EXPERT MENTORSHIP",
    title: "1-on-1 Guidance from Industry Pros",
    desc: "Get personalised mentorship from professionals actively working in your field.",
  },
  {
    tag: "LIVE CLASSROOMS",
    title: "Interactive Cohort-Based Sessions",
    desc: "Join live classes, collaborate with peers, and learn in a structured cohort format.",
  },
  {
    tag: "CAREER SUPPORT",
    title: "Placement Assistance & Resume Help",
    desc: "From portfolio reviews to mock interviews — we support you until you land the job.",
  },
];

const FAQS = [
  {
    q: "What courses does American FutureTech LLC offer?",
    a: "We offer industry-focused programs in Data Science, Cyber Security, and Artificial Intelligence. Our courses are designed to provide both theoretical knowledge and hands-on experience, helping students build real-world skills required in today's tech industry.",
  },
  {
    q: "Are your courses suitable for beginners?",
    a: "Yes. Our programs are structured for both beginners and seasoned professionals, with foundational modules that build up to advanced, job-ready skills.",
  },
  {
    q: "Do you provide job placement or career support?",
    a: "Yes. Every learner gets access to placement assistance, resume help, mock interviews, and our network of 200+ hiring partners.",
  },
];

/* ---------------- Hook: reveal-on-scroll ---------------- */

const useInView = (options = {}) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.25, ...options });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

/* ---------------- Hook: count-up ---------------- */

const useCountUp = (target, inView, duration = 1600) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = null;
    let frame;
    const step = (ts) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      setValue(Math.floor(eased * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [inView, target, duration]);

  return value;
};

/* ---------------- Small components ---------------- */

const Reveal = ({ children, className = "", delay = 0 }) => {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const StatCounter = ({ stat }) => {
  const [ref, inView] = useInView();
  const value = useCountUp(stat.value, inView);
  const display = stat.value >= 1000 ? value.toLocaleString() : value;

  return (
    <div
      ref={ref}
      className="group relative rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1"
    >
      <p className="text-3xl sm:text-4xl font-extrabold text-primary tabular-nums transition-transform duration-300 group-hover:scale-110">
        {display}
        {stat.suffix}
      </p>
      <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
      <span className="absolute inset-x-6 -bottom-1 h-px scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
    </div>
  );
};

const FaqItem = ({ item, isOpen, onToggle }) => (
  <div
    className={`rounded-2xl border bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-all duration-300 ${
      isOpen
        ? "border-primary/40 shadow-lg shadow-primary/10"
        : "border-slate-200 dark:border-slate-700 hover:border-primary/30 hover:shadow-md"
    }`}
  >
    <button
      onClick={onToggle}
      aria-expanded={isOpen}
      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left group"
    >
      <span
        className={`font-medium transition-colors ${
          isOpen
            ? "text-primary"
            : "text-slate-800 dark:text-slate-100 group-hover:text-primary"
        }`}
      >
        {item.q}
      </span>
      <ChevronDown
        size={20}
        className={`shrink-0 text-primary transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
      }`}
    >
      <div className="overflow-hidden">
        <p className="px-6 pb-6 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
          {item.a}
        </p>
      </div>
    </div>
  </div>
);

/* Tilt card wrapper — subtle 3D tilt that follows the cursor */
const TiltCard = ({ children, className = "" }) => {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateX(${-y * 6}deg) rotateY(${
      x * 6
    }deg) translateY(-4px)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  );
};

/* ---------------- Home page ---------------- */

const Home = () => {
  const courses = useResourceList(courseService, { limit: 3 });
  const [openFaq, setOpenFaq] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail("");
  };

  return (
    <>
      <Helmet>
        <title>American No.1 Edtech Company With Job Placement</title>
        <meta
          name="description"
          content="Industry-aligned tech training programs with real placement support."
        />
        <meta property="og:title" content="American FutureTech" />
      </Helmet>

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-transparent">
        {/* animated background blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="pointer-events-none absolute top-40 -right-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl animate-blob [animation-delay:2s]" />

        <div className="container-page relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-16">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-800 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-6 animate-pulse-slow">
              <ShieldCheck size={14} /> 100% Satisfaction Guarantee
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
              Boost Your Skills.
              <br />
              Secure Your Future with{" "}
              <span className="relative inline-block text-primary">
                American FutureTech
                <Sparkles
                  size={20}
                  className="absolute -right-6 -top-2 text-amber-400 animate-sparkle"
                />
              </span>
            </h1>

            <p className="mt-6 text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
              <strong>American FutureTech</strong> — The ultimate destination for
              learners to level up. Expert-led training with real-world
              projects. Build skills. Get job-ready. Secure your placement.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/courses"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3 text-sm font-semibold text-black shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                <span className="absolute inset-0 -translate-x-full bg-blue-500 transition-transform duration-500 group-hover:translate-x-0" />
                <span className="relative">Get Started</span>
                <ArrowRight
                  size={16}
                  className="relative transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                to="/careers"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 px-7 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-0.5 hover:border-primary/50 active:translate-y-0 active:scale-95"
              >
                Explore Jobs
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="rounded-full border border-slate-200 dark:border-slate-700 px-6 py-3 text-center transition-all duration-300 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 cursor-default">
                <p className="text-xl font-extrabold text-slate-900 dark:text-white">
                  10.2K+
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Total Happy Students
                </p>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill="currentColor"
                    className="transition-transform duration-300 hover:scale-125"
                    style={{ transitionDelay: `${i * 40}ms` }}
                  />
                ))}
                <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  4.8 Ratings
                </span>
              </div>
            </div>
          </Reveal>

          {/* Hero visual */}
          <Reveal delay={150} className="relative flex justify-center">
            <div className="relative w-72 sm:w-80 animate-float">
              <div className="h-96 w-full rounded-[2.5rem] bg-gradient-to-b from-emerald-400 to-emerald-500 shadow-2xl transition-transform duration-500 hover:scale-[1.02]" />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] rounded-2xl bg-white dark:bg-slate-800 px-5 py-4 shadow-xl flex items-center gap-4 transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="flex -space-x-2">
                  {["AK", "JD", "MR"].map((i) => (
                    <span
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary ring-2 ring-white dark:ring-slate-800"
                    >
                      {i}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-lg font-extrabold text-slate-900 dark:text-white">
                    45+
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Expert Instructor
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Marquee strip */}
        <div className="border-y border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 overflow-hidden">
          <div className="flex w-max animate-marquee whitespace-nowrap gap-12 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:[animation-play-state:paused]">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
              (item, i) => (
                <span
                  key={i}
                  className="flex items-center gap-3 transition-colors hover:text-primary"
                >
                  {item} <span className="text-primary animate-spin-slow">✳</span>
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <section className="container-page py-16">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block rounded-full border border-primary/30 px-4 py-1 text-xs font-semibold text-primary mb-4">
            + WHY CHOOSE US
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Discover how our programs turn{" "}
            <span className="text-primary italic">ambition</span> into{" "}
            <span className="text-primary italic">achievement.</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Learn from industry experts, work on real projects, and follow a
            path designed just for you — all in one powerful platform.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {WHY_CHOOSE.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <TiltCard>
                <div className="group relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 text-center shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/30 cursor-default overflow-hidden">
                  <span className="absolute inset-0 scale-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent transition-transform duration-500 group-hover:scale-100" />
                  <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    {item.icon}
                  </div>
                  <h3 className="relative text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="relative text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- STATS + PARTNERS ---------------- */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-white">
        <div className="container-page">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center mb-14">
            {STATS.map((s) => (
              <StatCounter key={s.label} stat={s} />
            ))}
          </div>

          <Reveal>
            <p className="text-center text-xs font-semibold tracking-widest text-slate-400 uppercase mb-8">
              Trusted by professionals at
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {PARTNER_LOGOS.map((name) => (
                <div
                  key={name}
                  className="rounded-xl bg-white/5 border border-white/10 px-4 py-4 text-center text-sm font-semibold text-slate-200 transition-all duration-300 hover:bg-white/10 hover:border-primary/40 hover:-translate-y-1 hover:text-white cursor-default"
                >
                  {name}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- ABOUT ---------------- */}
      {/* <section className="container-page py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal className="relative">
            <div className="rounded-[2rem] bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 h-80 w-full transition-transform duration-500 hover:scale-[1.01]" />
            <div className="absolute -top-6 -left-6 rounded-xl bg-blue-600 text-white px-5 py-4 shadow-xl text-center animate-float [animation-duration:4s]">
              <p className="text-xl font-extrabold">12+</p>
              <p className="text-xs">Years of Experiences</p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex flex-wrap gap-6 mb-6 text-sm font-semibold">
              <span className="text-primary border-b-2 border-primary pb-1">
                About Company
              </span>
              <span className="text-slate-500 dark:text-slate-400 transition-colors hover:text-primary cursor-pointer">
                Our Mission
              </span>
              <span className="text-slate-500 dark:text-slate-400 transition-colors hover:text-primary cursor-pointer">
                Our Vision
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Learn what matters. Achieve what you dream — your future in
              tech starts here. At American FutureTech, we transform careers
              through industry-driven, practical education. Our expert-led
              training, real-world projects, and personalized mentorship
              ensure true skill mastery. We equip learners with in-demand,
              future-ready skills aligned with the global digital economy.
              Our programs build confidence, making you job-ready for
              competitive international opportunities. We don't just
              teach — we empower, innovate, and create globally competitive
              professionals.
            </p>
            <Link
              to="/about"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Learn more{" "}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </section> */}

      {/* ---------------- POPULAR COURSES ---------------- */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16">
        <div className="container-page">
          <Reveal className="text-center mb-10">
            <span className="text-xs font-semibold tracking-widest text-primary uppercase">
              Popular Courses
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Pick A Course To Get Started
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.loading ? (
              <p className="text-slate-500 col-span-full text-center">
                Loading courses...
              </p>
            ) : (
              courses.items.map((course, i) => (
                <Reveal key={course.id} delay={i * 80}>
                  <TiltCard className="h-full">
                    <CourseCard
                      course={{
                        ...course,
                        category: course.category?.name,
                        price: formatCurrencyINR(course.price),
                      }}
                    />
                  </TiltCard>
                </Reveal>
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/courses"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Browse more courses{" "}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- CERTIFICATES ---------------- */}
      <section className="container-page py-16">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block rounded-full border border-primary/30 px-4 py-1 text-xs font-semibold text-primary mb-4">
            SPECIALIZATIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Credentials That <span className="text-primary">Open Doors</span>
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Industry-recognized Microsoft certifications earned through
            American FutureTech LLC — proof of real-world skills.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CERTIFICATES.map((cert, i) => (
            <Reveal key={cert.title} delay={i * 80}>
              <div className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30">
                <div className="relative h-40 bg-gradient-to-br from-blue-900 to-slate-800 flex items-center justify-center text-white/40 text-xs font-semibold uppercase tracking-widest overflow-hidden">
                  <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {cert.tier}
                </div>
                <div className="p-6">
                  <p className="text-xs font-semibold text-slate-400 mb-1">
                    {cert.provider}
                  </p>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-4 leading-snug">
                    {cert.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {cert.date}
                    </span>
                    <a
                      href="#"
                      className="group/link inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      View credential{" "}
                      <ExternalLink
                        size={14}
                        className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- PROGRAM FEATURES ---------------- */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-16">
        <div className="container-page">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-10">
              Why Our Programs Stand Out
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PROGRAM_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30">
                  <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 transition-transform duration-500 group-hover:scale-105" />
                  <div className="p-6">
                    <span className="text-xs font-semibold tracking-widest text-primary uppercase">
                      {f.tag}
                    </span>
                    <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TRIAL CTA + FAQ ---------------- */}
      <section className="container-page py-16">
        <Reveal className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            <span className="text-amber-500">Ready</span> To Start Your{" "}
            <span className="text-red-500">Trial</span> Today
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courses"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-primary transition-colors"
            >
              Get Started Now{" "}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-slate-600 px-6 py-2.5 text-sm font-semibold text-slate-800 dark:text-slate-100 transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:-translate-y-0.5 hover:border-primary/50 active:scale-95"
            >
              Contact For Free <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>

        <div className="max-w-7xl mx-auto">
          <Reveal>
            <span className="text-xs font-semibold tracking-widest text-red-500 uppercase">
              FAQ's
            </span>
            <h2 className="mt-2 mb-8 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions.
            </h2>
          </Reveal>

          <div className="space-y-4">
            {FAQS.map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <FaqItem
                  item={item}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- NEWSLETTER ---------------- */}
      {/* <section className="relative overflow-hidden bg-slate-900 py-16 text-white">
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-primary/20 blur-3xl animate-blob" />
        <div className="container-page relative flex flex-col lg:flex-row items-center justify-between gap-8">
          <Reveal>
            <h2 className="text-2xl sm:text-3xl font-bold text-center lg:text-left max-w-xl">
              Quickly Get Updates About Your Class Event and News!
            </h2>
          </Reveal>
          <Reveal delay={100} className="w-full max-w-md">
            <form
              onSubmit={handleSubscribe}
              className="flex w-full items-center gap-2 rounded-full bg-white/5 border border-white/10 p-1.5 transition-all duration-300 focus-within:border-primary/60 focus-within:bg-white/10"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-primary/90 active:scale-95"
              >
                {subscribed ? "Subscribed ✓" : "Subscribe"}
                {!subscribed && <ArrowRight size={16} />}
              </button>
            </form>
          </Reveal>
        </div>
      </section> */}

      <CTA />

      {/* ---------------- Local animation keyframes ---------------- */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .animate-marquee { animation: marquee 22s linear infinite; }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 5s ease-in-out infinite; }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -30px) scale(1.1); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }
        .animate-blob { animation: blob 10s ease-in-out infinite; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow { animation: pulse-slow 2.5s ease-in-out infinite; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { display: inline-block; animation: spin-slow 4s linear infinite; }

        @keyframes sparkle {
          0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
          50% { opacity: 0.4; transform: scale(0.8) rotate(15deg); }
        }
        .animate-sparkle { animation: sparkle 1.8s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .animate-marquee, .animate-float, .animate-blob,
          .animate-pulse-slow, .animate-spin-slow, .animate-sparkle {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Home;