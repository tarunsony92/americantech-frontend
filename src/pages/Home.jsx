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
  Users,
  BookOpen,
  Zap,
  Award,
} from "lucide-react";
import CourseCard from "../components/CourseCard";
import CTA from "../components/CTA";
import courseService from "../services/courseService";
import useResourceList from "../hooks/useResourceList";
import { formatCurrencyINR } from "../utils/format";
import heroDeskImg from "../assets/hero-desk.png";


/* ---------------- Static content (from site copy) ---------------- */

const MARQUEE_ITEMS = [
  "Cyber Security With AI",
  "Agentic AI",
  "Generative AI",
  "Data Science",
];

/*
  IMAGE NOTE:
  Each item below has an `image` field pointing to LoremFlickr
  (https://loremflickr.com), a free keyword-based placeholder service.
  Every URL includes a `?lock=N` parameter with a unique number —
  this pins LoremFlickr to a single specific photo instead of picking
  a new random match on every page load/refresh, so images stay stable.

  IMPORTANT: This is still only safe for local dev/staging. LoremFlickr
  images are sourced from Flickr's Creative Commons pool, and even a
  "locked" image carries whatever license/attribution terms that Flickr
  photo has. Swap these for your own licensed photos (or Microsoft-
  approved partner assets for the certificate art) before going to
  production — nothing else in the markup needs to change.
*/

const WHY_CHOOSE = [
  {
    icon: "🖥️",
    title: "Microsoft Certificate",
    desc: "Get industry-recognised Microsoft credentials.",
    image: "https://loremflickr.com/800/600/graduation,diploma,certificate?lock=1",
  },
  {
    icon: "🧑‍🤝‍🧑",
    title: "Industry Connections",
    desc: "Access our network of 200+ industry hiring partners and unlock real career opportunities.",
    image: "https://loremflickr.com/800/600/handshake,business,partnership?lock=2",
  },
  {
    icon: "✅",
    title: "Career Acceleration",
    desc: "Our mentees see 3x faster career growth compared to traditional learning paths.",
    image: "https://loremflickr.com/800/600/success,growth,career?lock=3",
  },
  {
    icon: "👥",
    title: "1-on-1 Sessions",
    desc: "Regular private sessions with your dedicated mentor for fully personalised support.",
    image: "https://loremflickr.com/800/600/mentor,coaching,meeting?lock=4",
  },
];

const STATS = [
  { icon: Users, value: 10200, suffix: "+", label: "Students Trained" },
  { icon: Award, value: 200, suffix: "+", label: "Hiring Partners" },
  { icon: Zap, value: 3, suffix: "x", label: "Faster Career Growth" },
  { icon: BookOpen, value: 98, suffix: "%", label: "Satisfaction Rate" },
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
    image: "https://loremflickr.com/800/450/artificialintelligence,robot?lock=5",
  },
  {
    provider: "Microsoft",
    title: "Data Science Professional Certificate",
    date: "Jun 23, 2023",
    tier: "FUNDAMENTALS",
    image: "https://loremflickr.com/800/450/datascience,analytics?lock=6",
  },
  {
    provider: "Microsoft",
    title: "Cyber Security with AI Professional Certificate",
    date: "Oct 29, 2022",
    tier: "EXPERT",
    image: "https://loremflickr.com/800/450/cybersecurity,hacking?lock=7",
  },
];

const PROGRAM_FEATURES = [
  {
    tag: "HANDS-ON LEARNING",
    title: "Industry-Ready Tech Curriculum",
    desc: "Learn by building real projects with tools used by top companies — from day one.",
    image: "/static/images/why1.jpg",
  },
  {
    tag: "EXPERT MENTORSHIP",
    title: "1-on-1 Guidance from Industry Professionals",
    desc: "Get personalised mentorship from professionals actively working in your field.",
    image: "/static/images/why2.png",
  },
  {
    tag: "LIVE CLASSROOMS",
    title: "Interactive Cohort-Based Sessions",
    desc: "Join live classes, collaborate with peers, and learn in a structured cohort format.",
    image: "/static/images/why3.jpg",
  },
  {
    tag: "CAREER SUPPORT",
    title: "Placement Assistance & Resume Help",
    desc: "From portfolio reviews to mock interviews — we support you until you land the job.",
    image: "/static/images/why4.jpg",  },
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
              Build Skills.
              <br />
              Get Certified with{" "}
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

          {/* Hero visual — local photo (desk/laptop scene) */}
          <Reveal delay={150} className="relative flex justify-center">
            <div className="relative w-full max-w-md animate-float">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={heroDeskImg}
                  alt="American FutureTech workspace with laptop and course materials"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
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
      <TiltCard className="h-full">
        <div className="group h-90 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-primary/30 cursor-default">

          {/* Fixed Image Height */}
          <div className="relative h-52 w-full overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            <div className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-xl shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              {item.icon}
            </div>
          </div>

          {/* Equal Content Height */}
          <div className="flex flex-col flex-1 p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white min-h-[56px]">
              {item.title}
            </h3>

            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1">
              {item.desc}
            </p>
          </div>

        </div>
      </TiltCard>
    </Reveal>
  ))}
</div>
      </section>

      {/* ---------------- STATS + PARTNERS ---------------- */}
<section className="bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-white">
  <div className="container-page">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-14">
      {STATS.map((s) => (
        <StatCounter key={s.label} stat={s} />
      ))}
    </div>

    <Reveal>
      <div className="flex items-center justify-center gap-4 mb-10">
        <span className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-slate-700" />
        <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase whitespace-nowrap">
          Trusted by professionals at
        </p>
        <span className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-slate-700" />
      </div>

      <div className="relative overflow-hidden">
        <span className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-900 to-transparent z-10" />
        <span className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-800 to-transparent z-10" />

        <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]">
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="group flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm px-8 py-5 min-w-[160px] transition-all duration-300 hover:bg-white/10 hover:border-primary/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10 cursor-default"
            >
              <span className="text-sm font-semibold tracking-wide text-slate-400 grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:text-white whitespace-nowrap">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  </div>
</section>

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
      <div className="group h-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30">

        {/* Fixed Image Size */}
        <div className="relative h-56 w-full overflow-hidden">
          <img
            src={cert.image}
            alt={cert.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />

          <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-slate-800">
            {cert.tier}
          </span>

          <span className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>

        {/* Equal Content Height */}
        <div className="flex flex-col flex-1 p-6">
          <p className="text-xs font-semibold text-slate-400 mb-1">
            {cert.provider}
          </p>

          <h3 className="font-semibold text-slate-900 dark:text-white leading-snug min-h-[56px]">
            {cert.title}
          </h3>

          <div className="mt-auto flex items-center justify-between pt-4">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {cert.date}
            </span>

            <a
              href="#"
              className="group/link inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View credential
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

          <div className="grid grid-cols-1 sm:grid-cols-2  gap-6">
            {PROGRAM_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-primary/30">
                 <div className="h-64  w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
  <img
    src={f.image}
    alt={f.title}
    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
    loading="lazy"
  />
</div>
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
