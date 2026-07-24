import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";

const STATS = [
  { label: "Students Trained", value: 12500, suffix: "+" },
  { label: "Hiring Partners", value: 180, suffix: "+" },
  { label: "Placement Rate", value: 92, suffix: "%" },
  { label: "Courses Offered", value: 40, suffix: "+" },
];

const Counter = ({ value, suffix }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl font-extrabold text-primary-600 dark:text-primary-400">
      {display.toLocaleString()}{suffix}
    </span>
  );
};

const Counters = () => (
  <section className="bg-primary-950 py-14 text-white">
    <div className="container-page grid grid-cols-2 gap-8 text-center md:grid-cols-4">
      {STATS.map((stat) => (
        <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Counter value={stat.value} suffix={stat.suffix} />
          <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  </section>
);

export default Counters;
