import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, Mail, RotateCcw, Phone, Globe } from "lucide-react";
import PageHeader from "../components/PageHeader";

const sections = [
  {
    id: "long-term",
    title: "1. Long-Term Courses (Duration: 6 Months and Above)",
    content: (
      <>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          How to Cancel
        </h4>
        <p className="mb-4">
          If you wish to cancel your enrollment, you must notify us in
          person, by email, by Certified Mail, or through direct written
          communication with American FutureTech LLC. Your cancellation
          will be effective on the date the notice is postmarked or
          officially received.
        </p>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Refund Policy — Full Refund
        </h4>
        <p className="mb-2">
          You will receive a full refund under the following circumstances:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>If your application is not accepted.</li>
          <li>
            If you cancel within three (3) business days of signing the
            enrollment agreement and making your initial payment.
          </li>
          <li>
            If you find the course unsatisfactory or choose to cancel for
            any reason, you may request cancellation. Course access will be
            terminated, and you will be charged only for the number of
            classes attended.
          </li>
        </ul>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Before Classes Begin
        </h4>
        <p className="mb-4">
          If you cancel after admission but before attending your first
          class, you will receive a refund of all payments made, except for
          the registration fee (capped at $99).
        </p>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          During Drop/Add Period
        </h4>
        <p className="mb-4">
          If you withdraw during the first week of classes, you will receive
          a refund of all tuition and fees paid, except for the registration
          fee.
        </p>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          After Drop/Add Period
        </h4>
        <p className="mb-4">No refunds will be issued after the first week of classes.</p>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Withdrawal from Program
        </h4>
        <p>
          If you withdraw from the program at any time, the refund structure
          outlined above will apply.
        </p>
      </>
    ),
  },
  {
    id: "short-term-classroom",
    title:
      "2. Short-Term Courses — Classroom / Instructor-Led Online Training",
    content: (
      <>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Cancellations by American FutureTech LLC
        </h4>
        <p className="mb-4">
          We reserve the right to postpone or cancel training sessions due
          to insufficient enrollment, instructor illness, or force majeure
          events (including but not limited to natural disasters or
          political instability). If a course is canceled by us, you will
          receive a 100% refund of the amount paid.
        </p>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Participant Cancellations
        </h4>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>7 Days or More Before the Event:</strong> 90% refund of
            the total paid fee (10% retained as a processing fee).
          </li>
          <li>
            <strong>Less Than 7 Days Before the Event:</strong> No refunds
            will be issued.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "online-training",
    title: "3. Online Training",
    content: (
      <>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Participant Cancellations
        </h4>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Within 48 Hours of Subscription:</strong> 95% refund of
            the total paid fee (5% retained as an administrative fee).
          </li>
          <li>
            <strong>After 48 Hours of Subscription:</strong> No refunds will
            be issued.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "third-party",
    title: "4. Third-Party Courses",
    content: (
      <>
        <p className="mb-2">
          For courses provided by third-party vendors (such as Microsoft
          Azure Registration or MS SharePoint):
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>50% refund if cancelled within 48 hours of payment.</li>
          <li>No refunds will be issued after 48 hours.</li>
        </ul>
      </>
    ),
  },
  {
    id: "consumer-notice",
    title: "5. USA Consumer Protection Notice",
    content: (
      <p>
        Customers located in the United States are entitled to a full refund
        within 14 days of purchase, provided that the course content has not
        been accessed, consumed, or downloaded.
      </p>
    ),
  },
  {
    id: "duplicate-payments",
    title: "6. Duplicate Payments",
    content: (
      <p>
        If a duplicate payment is made in error, a refund will be processed
        to the original payment method within 5–7 business days after
        notification.
      </p>
    ),
  },
  {
    id: "processing-time",
    title: "7. Refund Processing Time",
    content: (
      <p>
        All approved refunds will be processed within 30 days of receiving
        the refund request.
      </p>
    ),
  },
  {
    id: "contact",
    title: "8. Contact Us",
    content: (
      <>
        <p className="mb-4">
          If you have any questions or need assistance, please contact us
          at:
        </p>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-5 space-y-3">
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            American FutureTech LLC
          </p>
          <a
            href="mailto:info@americanfuturetechllc.com"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Mail size={16} /> info@americanfuturetechllc.com
          </a>
          <a
            href="mailto:support@americanfuturetechllc.com"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Mail size={16} /> support@americanfuturetechllc.com
          </a>
          <a
            href="tel:+919170096668"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Phone size={16} /> +91 92178 72078
          </a>
          <a
            href="https://americanfuturetechllc.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Globe size={16} /> americanfuturetechllc.com
          </a>
        </div>
      </>
    ),
  },
];

const AccordionItem = ({ section, isOpen, onToggle }) => {
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-semibold text-base sm:text-lg text-slate-800 dark:text-slate-100">
          {section.title}
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
          <div className="px-6 pb-6 pt-0 text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base border-t border-slate-100 dark:border-slate-800">
            <div className="pt-4">{section.content}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const RefundPolicy = () => {
  const [openId, setOpenId] = useState(sections[0].id);

  const toggleSection = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Helmet>
        <title>Refund And Return Policy | American FutureTech</title>
      </Helmet>
      <PageHeader
        title="Refund And Return Policy"
        breadcrumbItems={[{ label: "Refund And Return Policy" }]}
      />

      <section className="container-page max-w-7xl py-16">
        {/* Intro card */}
        <div className="mb-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-primary/5 to-transparent p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <RotateCcw size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              Refunds are Subject to Eligibility Criteria and Review Process
            </h1>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
            At <strong>American FutureTech LLC</strong>, we are committed to
            providing a positive and enriching learning experience through
            our online and classroom training programs. We understand that
            circumstances may change, and we strive to maintain a fair and
            transparent refund policy.
          </p>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            By purchasing a course from <strong>American FutureTech LLC</strong>,
            you agree to our Privacy Policy, Terms of Use, and the refund
            terms outlined below.
          </p>
        </div>

        {/* Accordion sections */}
        <div className="space-y-4">
          {sections.map((section) => (
            <AccordionItem
              key={section.id}
              section={section}
              isOpen={openId === section.id}
              onToggle={() => toggleSection(section.id)}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-slate-400 dark:text-slate-500">
          Copyright {new Date().getFullYear()} American FutureTech LLC — All
          Rights Reserved
        </p>
      </section>
    </>
  );
};

export default RefundPolicy;