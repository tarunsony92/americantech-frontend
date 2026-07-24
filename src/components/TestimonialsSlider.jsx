import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { HiStar } from "react-icons/hi";
import "swiper/css";
import "swiper/css/pagination";

const TestimonialsSlider = ({ testimonials = [] }) => (
  <Swiper
    modules={[Autoplay, Pagination]}
    autoplay={{ delay: 4500, disableOnInteraction: false }}
    pagination={{ clickable: true }}
    slidesPerView={1}
    spaceBetween={24}
    breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
    className="pb-10"
  >
    {testimonials.map((t) => (
      <SwiperSlide key={t.name}>
        <div className="card flex h-full flex-col gap-4 p-6">
          <div className="flex gap-1 text-amber-400">
            {Array.from({ length: t.rating }).map((_, i) => <HiStar key={i} className="h-4 w-4" />)}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">&ldquo;{t.quote}&rdquo;</p>
          <div className="mt-auto flex items-center gap-3">
            <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
);

export default TestimonialsSlider;
