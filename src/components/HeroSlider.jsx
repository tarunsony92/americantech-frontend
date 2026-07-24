import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const SLIDES = [
  {
    title: "Launch Your Tech Career With Confidence",
    subtitle: "Industry-aligned training programs with real placement support.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1600&q=80",
    ctaLabel: "Explore Courses",
    ctaTo: "/courses",
  },
  {
    title: "Learn From Industry Experts",
    subtitle: "Hands-on curriculum designed by professionals working at top companies.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1600&q=80",
    ctaLabel: "Meet Instructors",
    ctaTo: "/about",
  },
  {
    title: "180+ Hiring Partners Waiting For You",
    subtitle: "Graduate ready to work with our dedicated career services team.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1600&q=80",
    ctaLabel: "View Opportunities",
    ctaTo: "/careers",
  },
];

const HeroSlider = () => (
  <Swiper
    modules={[Autoplay, Pagination, EffectFade]}
    effect="fade"
    autoplay={{ delay: 5000, disableOnInteraction: false }}
    pagination={{ clickable: true }}
    loop
    className="h-[520px] w-full sm:h-[600px]"
  >
    {SLIDES.map((slide) => (
      <SwiperSlide key={slide.title}>
        <div className="relative flex h-full w-full items-center">
          <img src={slide.image} alt={slide.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent" />
          <div className="container-page relative z-10">
            <div className="max-w-xl text-white">
              <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">{slide.title}</h1>
              <p className="mt-4 text-lg text-slate-200">{slide.subtitle}</p>
              <div className="mt-8 flex gap-4">
                <Link to={slide.ctaTo} className="btn-primary">{slide.ctaLabel}</Link>
                <Link to="/contact" className="btn bg-white/10 text-white ring-1 ring-white/40 hover:bg-white/20">
                  Talk to Advisor
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

export default HeroSlider;
