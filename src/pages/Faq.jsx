import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import FaqAccordion from "../components/FaqAccordion";
import { faqService } from "../services/contentService";
import useResourceList from "../hooks/useResourceList";

const Faq = () => {
  const { items, loading, error } = useResourceList(faqService, { limit: 50 });

  return (
    <>
      <Helmet><title>FAQ | American FutureTech</title></Helmet>
      <PageHeader title="Frequently Asked Questions" breadcrumbItems={[{ label: "FAQ" }]} />

      <section className="container-page max-w-3xl py-16">
        {error && <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}
        {loading ? (
          <p className="text-slate-500">Loading FAQs...</p>
        ) : (
          <FaqAccordion items={items.map((f) => ({ question: f.question, answer: f.answer }))} />
        )}
      </section>
    </>
  );
};

export default Faq;
