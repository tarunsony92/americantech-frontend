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
import { formatCurrencyUSD } from "../utils/format";
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
    image: "../../public/static/images/microsoftcertificate.jpg",
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
  "HCL",
  "ACCENTURE",
  "WALMART",
  "UBER",
  "AMAZON",
  "NETFLIX",
  "MORGAN STANLEY",
  "NVIDIA",
];

const CERTIFICATES = [
  {
    provider: "Microsoft",
    title: "Advanced Generative AI Professional Certificate",
    date: "Feb 2, 2024",
    tier: "FUNDAMENTALS",
    image: "../../public/static/images/generativeai.png",
  },
  {
    provider: "Microsoft",
    title: "Data Science Professional Certificate",
    date: "Jun 23, 2023",
    tier: "FUNDAMENTALS",
    image: "../../public/static/images/microsoftcertificate.jpg",
  },
  {
    provider: "Microsoft",
    title: "Cyber Security with AI Professional Certificate",
    date: "Oct 29, 2022",
    tier: "EXPERT",
    image: "../../public/static/images/microsoftsc.jpg",
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

  /* ---------------- Hero mouse-tracking (fog + tilt) ---------------- */
  const sectionRef = useRef(null);
  const rafRef = useRef(null);
  const [fogActive, setFogActive] = useState(false);

  // const targetMouse = useRef({ x: 50, y: 50 });
  // const currentMouse = useRef({ x: 50, y: 50 });

  const animateFog = () => {
    const el = sectionRef.current;
    if (!el) return;
    const current = currentMouse.current;
    const target = targetMouse.current;
    current.x += (target.x - current.x) * 0.075;
    current.y += (target.y - current.y) * 0.075;
    el.style.setProperty("--mouse-x", `${current.x}%`);
    el.style.setProperty("--mouse-y", `${current.y}%`);
    el.style.setProperty("--rotate-x", `${(current.y - 50) * -0.035}deg`);
    el.style.setProperty("--rotate-y", `${(current.x - 50) * 0.035}deg`);
    rafRef.current = requestAnimationFrame(animateFog);
  };

  const targetMouse = useRef({ x: 50, y: 50 });
  const currentMouse = useRef({ x: 50, y: 50 });
  const animationFrame = useRef(null);

  const handleMouseMove = (e) => {
    const el = sectionRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    targetMouse.current.x = ((e.clientX - rect.left) / rect.width) * 100;
    targetMouse.current.y = ((e.clientY - rect.top) / rect.height) * 100;
    if (animationFrame.current) return;
    const update = () => {
      const current = currentMouse.current;
      const target = targetMouse.current;
      current.x += (target.x - current.x) * 0.055;
      current.y += (target.y - current.y) * 0.055;
      el.style.setProperty("--mouse-x", `${current.x}%`);
      el.style.setProperty("--mouse-y", `${current.y}%`);
      el.style.setProperty("--rotate-x", `${(current.y - 50) * -0.025}deg`);
      el.style.setProperty("--rotate-y", `${(current.x - 50) * 0.025}deg`);
      animationFrame.current = requestAnimationFrame(update);
    };
    animationFrame.current = requestAnimationFrame(update);
  };

  const handleMouseEnter = () => {
    setFogActive(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animateFog);
  };

  const handleMouseLeave = () => {
    setFogActive(false);
    targetMouse.current = { x: 50, y: 50 };
    currentMouse.current = { x: 50, y: 50 };
    const el = sectionRef.current;
    if (!el) return;
    el.style.setProperty("--mouse-x", "50%");
    el.style.setProperty("--mouse-y", "50%");
    el.style.setProperty("--rotate-x", "0deg");
    el.style.setProperty("--rotate-y", "0deg");
  };

  useEffect(() => {
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail("");
  };


  function WhyChooseCard({ item, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TiltCard className="h-full">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="
          group relative h-[430px] w-full
          overflow-hidden rounded-3xl
          border border-slate-200/80
          bg-white
          shadow-sm
          transition-all duration-500
          hover:-translate-y-2
          hover:shadow-2xl hover:shadow-primary/10
          dark:border-slate-700/70
          dark:bg-slate-900
        "
      >
        {/* ================= IMAGE ================= */}
        <div
          className={`
            absolute inset-0 z-20
            transition-all duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              isHovered
                ? "scale-110 -translate-y-8 opacity-0"
                : "scale-100 translate-y-0 opacity-100"
            }
          `}
        >
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="
              h-full w-full
              object-cover object-center
              transition-transform duration-700
              group-hover:scale-105
            "
          />

          {/* Overlay */}
          <div
            className="
              absolute inset-0
              bg-gradient-to-t
              from-black/70
              via-black/20
              to-transparent
            "
          />

          {/* Number */}
          <div
            className="
              absolute right-5 top-5
              flex h-9 w-9
              items-center justify-center
              rounded-full
              border border-white/30
              bg-black/30
              text-xs font-bold text-white
              backdrop-blur-md
            "
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Icon */}
          <div
            className="
              absolute bottom-5 left-5
              flex h-12 w-12
              items-center justify-center
              rounded-2xl
              border border-white/40
              bg-white/90
              text-xl
              shadow-xl
              backdrop-blur-md
              transition-all duration-500
              group-hover:scale-110
              group-hover:rotate-3
            "
          >
            {item.icon}
          </div>

          {/* Title on Image */}
          <div
            className="
              absolute bottom-5 left-20 right-5
              transition-all duration-500
              group-hover:-translate-y-1
            "
          >
            <div className="mb-2 h-1 w-10 rounded-full bg-primary" />

            <h3
              className="
                text-xl font-bold leading-7
                text-white drop-shadow-lg
              "
            >
              {item.title}
            </h3>

            <p className="
              mt-1 text-xs font-medium
              text-white/80
            ">
              Hover to explore
            </p>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div
          className={`
            absolute inset-0 z-10
            flex flex-col
            bg-white p-7
            dark:bg-slate-900
            transition-all duration-700
            ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              isHovered
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }
          `}
        >
          {/* Decorative circles */}
          <div
            className="
              pointer-events-none
              absolute -right-16 -top-16
              h-40 w-40
              rounded-full
              bg-primary/10
              blur-2xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute -bottom-20 -left-16
              h-48 w-48
              rounded-full
              bg-primary/5
              blur-3xl
            "
          />

          {/* Header */}
          <div
            className={`
              relative
              transition-all duration-500 delay-150
              ${
                isHovered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span
                className="
                  rounded-full
                  border border-primary/20
                  bg-primary/5
                  px-3 py-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-primary
                "
              >
                Why Choose Us
              </span>

              <span
                className="
                  text-xs font-bold
                  text-slate-300
                  dark:text-slate-600
                "
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="mb-4 mt-5 h-1 w-12 rounded-full bg-primary" />

            <h3
              className="
                text-2xl font-bold
                leading-8
                text-slate-900
                dark:text-white
              "
            >
              {item.title}
            </h3>
          </div>

          {/* Description */}
          <div
            className={`
              relative mt-5 flex-1
              transition-all duration-500 delay-250
              ${
                isHovered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }
            `}
          >
            <p
              className="
                text-sm sm:text-base
                leading-7
                text-slate-600
                dark:text-slate-300
              "
            >
              {item.desc}
            </p>

            {/* Feature */}
            <div
              className="
                mt-7 flex items-center gap-3
                rounded-2xl
                border border-slate-200
                bg-slate-50
                p-4
                dark:border-slate-700
                dark:bg-slate-800/60
              "
            >
              <div
                className="
                  flex h-10 w-10 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-primary/10
                  text-primary
                "
              >
                {item.icon}
              </div>

              <div>
                <p className="
                  text-sm font-semibold
                  text-slate-900
                  dark:text-white
                ">
                  Built for your growth
                </p>

                <p className="
                  mt-0.5 text-xs
                  text-slate-500
                  dark:text-slate-400
                ">
                  Practical learning with real-world impact
                </p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div
            className={`
              relative mt-auto
              transition-all duration-500 delay-300
              ${
                isHovered
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0"
              }
            `}
          >
            <div className="
              mb-5 h-px w-full
              bg-slate-200
              dark:bg-slate-700
            " />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />

                <span className="
                  text-xs font-semibold
                  uppercase tracking-wider
                  text-slate-400
                ">
                  Explore
                </span>
              </div>

              <span className="
                rounded-full
                bg-primary/10
                px-3 py-1.5
                text-xs font-semibold
                text-primary
              ">
                Hover to return
              </span>
            </div>
          </div>
        </div>

        {/* Border Glow */}
        <div
          className="
            pointer-events-none
            absolute inset-0 z-30
            rounded-3xl
            ring-1 ring-inset
            ring-transparent
            transition-all duration-500
            group-hover:ring-primary/20
          "
        />
      </div>
    </TiltCard>
  );
}



  return (
    <>
      <Helmet>
        <title>American FutureTech</title>
        <meta
          name="description"
          content="Industry-aligned tech training programs with real placement support."
        />
        <meta property="og:title" content="American FutureTech" />
      </Helmet>

      {/* ---------------- HERO ---------------- */}
<section
  ref={sectionRef}
  onMouseMove={handleMouseMove}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
  className="
    group/hero
    relative
    overflow-hidden
    bg-gradient-to-b
    from-primary/5
    via-transparent
    to-transparent
    [--mouse-x:50%]
    [--mouse-y:50%]
    [--rotate-x:0deg]
    [--rotate-y:0deg]
  "
>
  {/* ================= PREMIUM HERO AMBIENT ANIMATION ================= */}
  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div aria-hidden="true" className={`hero-orb hero-orb-1 ${fogActive ? "hero-orb-active" : ""}`} style={{ left: "var(--mouse-x)", top: "var(--mouse-y)" }} />
    <div aria-hidden="true" className={`hero-orb hero-orb-2 ${fogActive ? "hero-orb-active" : ""}`} style={{ left: "calc(var(--mouse-x) + 80px)", top: "calc(var(--mouse-y) - 60px)" }} />
    <div aria-hidden="true" className={`hero-orb hero-orb-3 ${fogActive ? "hero-orb-active" : ""}`} style={{ left: "calc(var(--mouse-x) - 100px)", top: "calc(var(--mouse-y) + 80px)" }} />
    <div className="hero-bg-glow hero-bg-glow-1" />
    <div className="hero-bg-glow hero-bg-glow-2" />
    <div className="hero-grid" />
  </div>

  {/* ================= CONTENT ================= */}
  <div className="container-page relative z-20 grid grid-cols-1 items-center gap-16 py-20 lg:grid-cols-2 lg:py-28">

    {/* LEFT */}
    <Reveal>
      <span
        className="
          mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200
          bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm
          transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md
          dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300
        "
      >
        <ShieldCheck size={14} />
        100% Satisfaction Guarantee
      </span>

      <h1
  className="
    relative
    max-w-3xl
    text-4xl
    font-black
    leading-[1.05]
    tracking-[-0.03em]
    text-slate-950
    dark:text-white
    sm:text-5xl
    lg:text-6xl
    xl:text-7xl
  "
>
  <span className="block">
    Build Skills.
  </span>

  <span className="block mt-2">
    Get Certified with
  </span>

  <span className="relative mt-2 inline-block">
    {/* Soft glow behind brand */}
    <span
      aria-hidden="true"
      className="
        absolute
        -inset-3
        -z-10
        rounded-2xl
        bg-gradient-to-r
        from-primary/20
        via-violet-500/15
        to-emerald-400/20
        blur-2xl
        opacity-70
        animate-pulse-slow
      "
    />

    <span
      className="
        bg-gradient-to-r
        from-primary
        via-blue-950
        to-emerald-500
        bg-clip-text
        text-transparent
        [background-size:200%_auto]
        animate-gradient-text
      "
    >
      American
    </span>

    {" "}

    <span
      className="
        bg-gradient-to-r
        from-red-500
        via-rose-500
        to-orange-500
        bg-clip-text
        text-transparent
      "
    >
      FutureTech
    </span>

    {/* Sparkle */}
    <Sparkles
      size={22}
      strokeWidth={2}
      className="
        absolute
        -right-8
        -top-3
        text-amber-400
        drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]
        animate-sparkle
      "
    />

    {/* Small accent line */}
    <span
      className="
        absolute
        -bottom-2
        left-0
        h-1
        w-24
        rounded-full
        bg-gradient-to-r
        from-primary
        to-transparent
        opacity-80
      "
    />
  </span>
</h1>

      <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
        <strong className="text-slate-800 dark:text-white">American FutureTech</strong> — the ultimate
        destination for learners to level up. Expert-led training with real-world projects.
        Build skills. Get job-ready. Secure your placement.
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-4">
        <Link
          to="/courses"
          className="
            group relative inline-flex items-center gap-2 overflow-hidden rounded-full
            bg-primary px-8 py-3.5 text-sm font-semibold text-black shadow-lg shadow-primary/30
            transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/40 active:scale-95
          "
        >
          <span className="absolute inset-0 -translate-x-full bg-blue-500 transition-transform duration-500 group-hover:translate-x-0" />
          <span className="relative">Get Started</span>
          <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        <Link
          to="/jobscourse"
          className="
            inline-flex items-center gap-2 rounded-full border border-slate-300 px-8 py-3.5
            text-sm font-semibold text-slate-800 transition-all duration-300
            hover:-translate-y-1 hover:border-primary/50 hover:bg-white hover:shadow-lg
            dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800
          "
        >
          Explore Jobs
        </Link>
      </div>

      {/* Stats row */}
      <div className="mt-11 flex flex-wrap items-center gap-6">
        <div
          className="
            rounded-2xl border border-slate-200 bg-white/70 px-6 py-3.5 text-center shadow-sm
            backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg
            dark:border-slate-700 dark:bg-slate-900/50
          "
        >
          <p className="text-xl font-extrabold text-slate-900 dark:text-white">10.2K+</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Total Happy Students</p>
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
          <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-200">4.8 Ratings</span>
        </div>
      </div>
    </Reveal>

    {/* ================= HERO IMAGE ================= */}
    <Reveal delay={150} className="relative flex justify-center">
      <div
        className="relative w-full max-w-md transition-transform duration-300 ease-out"
        style={{
          transform: `perspective(1000px) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))`,
        }}
      >
        <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-r from-primary/25 via-emerald-400/15 to-primary/25 blur-3xl" />

        <div
          className="
            relative aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] border border-white/50
            shadow-2xl transition-all duration-500 hover:scale-[1.02] dark:border-slate-700
          "
        >
          <img
            src={heroDeskImg}
            alt="American FutureTech workspace with laptop and course materials"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            loading="eager"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />
        </div>

        {/* Floating instructor card */}
        <div
          className="
            absolute -bottom-6 left-1/2 flex w-[90%] -translate-x-1/2 items-center gap-4
            rounded-2xl border border-white/50 bg-white/90 px-5 py-4 shadow-xl backdrop-blur-xl
            transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl
            dark:border-slate-700 dark:bg-slate-800/90
          "
        >
          <div className="flex -space-x-2">
            {["AK", "JD", "MR"].map((i) => (
              <span
                key={i}
                className="
                  flex h-8 w-8 items-center justify-center rounded-full bg-primary/10
                  text-[10px] font-semibold text-primary ring-2 ring-white dark:ring-slate-800
                "
              >
                {i}
              </span>
            ))}
          </div>
          <div>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">45+</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Expert Instructor</p>
          </div>
        </div>
      </div>
    </Reveal>
  </div>

  {/* ================= MARQUEE ================= */}
  <div className="relative z-20 overflow-hidden border-y border-slate-100 bg-[#DEDC7E] py-4 dark:border-slate-800">
    <div className="flex w-max animate-marquee gap-12 whitespace-nowrap text-sm font-semibold text-black hover:[animation-play-state:paused]">
      {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
        <span key={i} className="flex items-center gap-3 transition-colors hover:text-primary">
          {item}
          <span className="animate-spin-slow text-primary">✳</span>
        </span>
      ))}
    </div>
  </div>
</section>

      {/* ---------------- WHY CHOOSE US ---------------- */}
      <section className="container-page py-16">
  <Reveal className="mx-auto mb-12 max-w-2xl text-center">
    <span className="mb-4 inline-block rounded-full border border-primary/30 px-4 py-1 text-xs font-semibold text-primary">
      + WHY CHOOSE US
    </span>

    <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
      Discover how our programs turn{" "}
      <span className="italic text-primary">ambition</span> into{" "}
      <span className="italic text-primary">achievement.</span>
    </h2>

    <p className="mt-4 text-slate-600 dark:text-slate-300">
      Learn from industry experts, work on real projects, and follow a path
      designed just for you — all in one powerful platform.
    </p>
  </Reveal>

  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
    {WHY_CHOOSE.map((item, i) => (
      <Reveal key={item.title} delay={i * 80}>
        <WhyChooseCard item={item} index={i} />
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
  <span className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-950 to-transparent" />
  <span className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-slate-950 to-transparent" />

  <div className="flex w-max animate-marquee gap-6 hover:[animation-play-state:paused]">
    {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((name, i) => (
      <div
        key={`${name}-${i}`}
        className="group flex min-w-[160px] cursor-default items-center justify-center rounded-xl border border-white/10 bg-white px-8 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 font-bold text-slate-900 dark:bg-slate-800 dark:text-white"
      >
        <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-black transition-all duration-300 group-hover:text-black">
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
                        price: formatCurrencyUSD(course.price),
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

            {/* <a
              href="#"
              className="group/link inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
            >
              View credential
              <ExternalLink
                size={14}
                className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </a> */}
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
.hero-orb { position:absolute; width:520px; height:520px; transform:translate(-50%,-50%); border-radius:50%; pointer-events:none; opacity:0; filter:blur(90px); will-change:transform,left,top,border-radius,opacity; transition:left 900ms cubic-bezier(0.16,1,0.3,1),top 900ms cubic-bezier(0.16,1,0.3,1),opacity 800ms ease; }
.hero-orb-1 { background:radial-gradient(circle at 35% 35%,rgba(99,102,241,.55),rgba(79,70,229,.32) 28%,rgba(30,27,75,.24) 52%,transparent 75%); animation:orbMorph1 12s ease-in-out infinite,orbFloat1 15s ease-in-out infinite; }
.hero-orb-2 { width:380px;height:380px;background:radial-gradient(circle,rgba(168,85,247,.42),rgba(124,58,237,.28) 35%,rgba(76,29,149,.16) 55%,transparent 75%);filter:blur(75px);animation:orbMorph2 9s ease-in-out infinite,orbFloat2 11s ease-in-out infinite; }
.hero-orb-3 { width:340px;height:340px;background:radial-gradient(circle,rgba(16,185,129,.35),rgba(5,150,105,.22) 35%,rgba(6,78,59,.14) 55%,transparent 75%);filter:blur(80px);animation:orbMorph3 14s ease-in-out infinite,orbFloat3 13s ease-in-out infinite; }
.hero-orb-active { opacity:1; }

@keyframes gradient-text {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient-text {
  animation: gradient-text 5s ease-in-out infinite;
}
@keyframes orbMorph1 { 0%{border-radius:50% 50% 50% 50%/50% 50% 50% 50%;scale:1}20%{border-radius:65% 35% 55% 45%/45% 60% 40% 55%;scale:1.08}40%{border-radius:35% 65% 45% 55%/60% 40% 60% 40%;scale:.94}60%{border-radius:55% 45% 65% 35%/40% 60% 45% 55%;scale:1.12}80%{border-radius:40% 60% 35% 65%/55% 45% 60% 40%;scale:.97}100%{border-radius:50% 50% 50% 50%/50% 50% 50% 50%;scale:1} }
@keyframes orbMorph2 { 0%{border-radius:50%;scale:1}30%{border-radius:40% 60% 55% 45%/60% 40% 45% 55%;scale:1.15}60%{border-radius:65% 35% 40% 60%/45% 55% 60% 40%;scale:.88}100%{border-radius:50%;scale:1} }
@keyframes orbMorph3 { 0%{border-radius:50%}35%{border-radius:60% 40% 35% 65%/45% 55% 65% 35%}70%{border-radius:35% 65% 60% 40%/60% 40% 45% 55%}100%{border-radius:50%} }
@keyframes orbFloat1 { 0%,100%{margin-left:0;margin-top:0;rotate:0deg}25%{margin-left:35px;margin-top:-25px;rotate:5deg}50%{margin-left:-20px;margin-top:30px;rotate:-4deg}75%{margin-left:25px;margin-top:15px;rotate:6deg} }
@keyframes orbFloat2 { 0%,100%{margin-left:0;margin-top:0}50%{margin-left:-45px;margin-top:35px} }
@keyframes orbFloat3 { 0%,100%{margin-left:0;margin-top:0}50%{margin-left:40px;margin-top:-30px} }
.hero-bg-glow { position:absolute;border-radius:50%;pointer-events:none;filter:blur(120px);animation:backgroundFloat 16s ease-in-out infinite; }
.hero-bg-glow-1 { width:500px;height:500px;left:-180px;top:-180px;background:radial-gradient(circle,rgba(79,70,229,.20),transparent 70%); }
.hero-bg-glow-2 { width:450px;height:450px;right:-160px;bottom:-120px;background:radial-gradient(circle,rgba(16,185,129,.16),transparent 70%);animation-delay:-6s; }
@keyframes backgroundFloat { 0%,100%{transform:translate3d(0,0,0) scale(1)}30%{transform:translate3d(40px,-30px,0) scale(1.08)}60%{transform:translate3d(-30px,40px,0) scale(.94)}80%{transform:translate3d(20px,10px,0) scale(1.04)} }
.hero-grid { position:absolute;inset:0;pointer-events:none;opacity:.035;background-image:linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px);background-size:45px 45px;mask-image:radial-gradient(ellipse at center,black 20%,transparent 75%); }
@keyframes marquee { 0%{transform:translateX(0)}100%{transform:translateX(-33.333%)} }
.animate-marquee { animation:marquee 22s linear infinite; }
@keyframes float { 0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)} }
.animate-float { animation:float 5s ease-in-out infinite; }
@keyframes blob { 0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(20px,-30px) scale(1.1)}66%{transform:translate(-15px,15px) scale(.95)} }
.animate-blob { animation:blob 10s ease-in-out infinite; }
@keyframes pulse-slow { 0%,100%{opacity:1}50%{opacity:.6} }
.animate-pulse-slow { animation:pulse-slow 2.5s ease-in-out infinite; }
@keyframes spin-slow { from{transform:rotate(0)}to{transform:rotate(360deg)} }
.animate-spin-slow { display:inline-block;animation:spin-slow 4s linear infinite; }
@keyframes sparkle { 0%,100%{opacity:1;transform:scale(1) rotate(0)}50%{opacity:.4;transform:scale(.8) rotate(15deg)} }
.animate-sparkle { animation:sparkle 1.8s ease-in-out infinite; }
@media (prefers-reduced-motion:reduce) { .hero-orb,.hero-bg-glow,.animate-marquee,.animate-float,.animate-blob,.animate-pulse-slow,.animate-spin-slow,.animate-sparkle { animation:none !important; } }
      `}</style>
    </>
  );
};

export default Home;