import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const PartnerSlider = ({ partners = [] }) => (
  <Swiper
    modules={[Autoplay]}
    autoplay={{ delay: 2500, disableOnInteraction: false }}
    loop
    slidesPerView={2}
    spaceBetween={32}
    breakpoints={{
      640: { slidesPerView: 3 },
      1024: { slidesPerView: 5 },
    }}
  >
    {partners.map((partner) => (
      <SwiperSlide key={partner.name} className="flex items-center justify-center py-4">
        <img src={partner.logo} alt={partner.name} className="h-10 w-auto grayscale transition-all hover:grayscale-0" />
      </SwiperSlide>
    ))}
  </Swiper>
);

export default PartnerSlider;
