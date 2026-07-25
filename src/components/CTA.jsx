import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTA = ({
  title = "Ready to launch your tech career?",
  subtitle = "Join thousands of graduates who transformed their careers with our industry-aligned programs.",
  ctaLabel = "Enroll Today",
  ctaTo = "/courses",
}) => (
  <section className="bg-gradient-to-b from-slate-900 to-slate-800 py-16 text-white">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container-page flex flex-col items-center gap-6 text-center"
    >
      <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      <p className="max-w-xl text-primary-100">{subtitle}</p>
      <Link to={ctaTo} className="btn bg-white text-primary-700 hover:bg-slate-100">
        {ctaLabel}
      </Link>
    </motion.div>
  </section>
);

export default CTA;
