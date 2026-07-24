import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import Counters from "../components/Counters";
import CTA from "../components/CTA";

const VALUES = [
  { title: "Industry-Aligned Curriculum", desc: "Courses built with input from hiring partners so skills map directly to job requirements." },
  { title: "Mentorship That Matters", desc: "Every learner is paired with mentors who've worked in the field they're training for." },
  { title: "Placement First", desc: "Career services and interview prep run alongside coursework, not after it." },
];

const About = () => (
  <>
    <Helmet><title>About Us | American Tech Global</title></Helmet>
    <PageHeader
      title="About American Tech Global"
      subtitle="We train tomorrow's technologists with practical, career-focused programs."
      breadcrumbItems={[{ label: "About" }]}
    />

    <section className="container-page py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="section-title">Our Mission</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            American Tech Global exists to close the gap between classroom learning and what employers
            actually need. We combine rigorous, hands-on instruction with dedicated placement support
            so every graduate leaves with both the skills and the connections to start a tech career.
          </p>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Since our founding, we've partnered with hiring companies across web development, data,
            cloud, security, and design to build curricula that reflect real job requirements.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800"
          alt="Students collaborating"
          className="w-full rounded-2xl object-cover shadow-lg"
        />
      </div>
    </section>

    <section className="bg-slate-50 py-16 dark:bg-slate-900">
      <div className="container-page">
        <h2 className="section-title text-center">What We Stand For</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title} className="card p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{v.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <Counters />
    <CTA />
  </>
);

export default About;
