import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, Mail, Globe, ShieldCheck } from "lucide-react";
import PageHeader from "../components/PageHeader";

const sections = [
  {
    id: "info-collect",
    title: "1. Information We Collect",
    content: (
      <>
        <p className="mb-4">
          We collect information you give us directly, along with certain
          data gathered automatically as you use the Website.
        </p>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          A. Information you provide
        </h4>
        <p className="mb-2">We may collect personal details when you:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Register or enroll in a course or program</li>
          <li>Submit an inquiry or contact form</li>
          <li>Sign up for newsletters or updates</li>
          <li>Communicate with us through the Website</li>
        </ul>
        <p className="mb-2">This may include:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Full name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Billing or payment details, where applicable</li>
          <li>Any other information you choose to share with us</li>
        </ul>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          B. Information collected automatically
        </h4>
        <p className="mb-2">
          While you browse the Website, we may automatically gather:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>IP address</li>
          <li>Browser and device information</li>
          <li>Pages visited and activity on the site</li>
          <li>Date, time, and duration of your visits</li>
          <li>Referring and exit pages</li>
        </ul>
        <p>
          This data is typically gathered using cookies, analytics tools, and
          similar tracking technologies.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "2. How We Use Your Information",
    content: (
      <>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>To operate, manage, and improve our Services</li>
          <li>To process enrollments, registrations, and payments</li>
          <li>To respond to inquiries and provide support</li>
          <li>To send updates, notifications, newsletters, and promotions</li>
          <li>To understand site usage and improve user experience</li>
          <li>To maintain security, prevent fraud, and meet legal obligations</li>
        </ul>
        <p>
          We do not sell, rent, or trade your personal information to third
          parties without your consent, except where the law requires it or
          it is necessary to deliver our Services.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "3. Cookies & Tracking",
    content: (
      <>
        <p className="mb-2">Cookies and similar technologies may be used to:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Improve site functionality and performance</li>
          <li>Remember your preferences and settings</li>
          <li>Analyze traffic and user behavior</li>
          <li>Enhance the overall browsing experience</li>
        </ul>
        <p>
          You can disable cookies in your browser settings, though some
          features of the Website may stop working properly as a result.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "4. Sharing Your Information",
    content: (
      <>
        <p className="mb-2">We may share your data with:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>
            Service providers and partners who help run our website, courses,
            and services
          </li>
          <li>Legal or government authorities, when required by law</li>
          <li>
            Third-party tools used for payments, communication, or our
            learning platform
          </li>
          <li>
            Other parties, with your consent or as needed to fulfill your
            request
          </li>
        </ul>
        <p>
          We take reasonable steps to protect shared information, but we are
          not responsible for the privacy practices of third-party sites or
          tools linked from our platform.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "5. Data Security",
    content: (
      <p>
        American FutureTech LLC applies reasonable technical and
        administrative safeguards to protect your information from
        unauthorized access, misuse, disclosure, or loss. No method of online
        transmission or storage is completely secure, so absolute protection
        cannot be guaranteed. You are responsible for keeping your account
        credentials confidential.
      </p>
    ),
  },
  {
    id: "rights",
    title: "6. Your Privacy Rights",
    content: (
      <>
        <p className="mb-2">Subject to applicable law, you may have the right to:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Access your personal information</li>
          <li>Request corrections or updates to your data</li>
          <li>Request deletion of your personal information</li>
          <li>Opt out of promotional communications</li>
          <li>Ask how your data is being used</li>
        </ul>
        <p>
          To exercise any of these rights, please reach out through our
          official contact channels.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "7. Children's Privacy",
    content: (
      <p>
        Our Website and Services are meant for individuals aged 13 and above.
        We do not knowingly collect information from children under 13. If we
        discover such information, we will take appropriate steps to remove
        it in line with applicable law.
      </p>
    ),
  },
  {
    id: "changes",
    title: "8. Changes to This Policy",
    content: (
      <p>
        We may update this policy from time to time. Any changes take effect
        once the revised version is posted on this page along with an updated
        date. Continuing to use the Website and Services after changes are
        posted means you accept the updated policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "9. Contact Us",
    content: (
      <>
        <p className="mb-4">
          If you have questions about this policy or want to exercise your
          rights, please contact us:
        </p>
        <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-5 space-y-3">
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            American FutureTech LLC
          </p>
          <a
            href="mailto:info@americantechgloballlc.com"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Mail size={16} /> info@americantechgloballlc.com
          </a>
          <a
            href="https://americantechgloballlc.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-primary hover:underline"
          >
            <Globe size={16} /> americantechgloballlc.com
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

const TermsAndConditions = () => {
  const [openId, setOpenId] = useState(sections[0].id);

  const toggleSection = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Helmet>
        <title>Terms & Conditions | American FutureTech</title>
      </Helmet>
      <PageHeader
        title="Terms & Conditions"
        breadcrumbItems={[{ label: "Terms & Conditions" }]}
      />

      <section className="container-page max-w-7xl mx-auto py-16 bg-slate-50 dark:bg-slate-900">
        {/* Intro card */}
        <div className="mb-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-primary/5 to-transparent p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <ShieldCheck size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              Student Terms & Conditions
            </h1>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
            Welcome to <strong>American FutureTech LLC</strong> ("Company,"
            "we," "our," or "us"). We value the privacy and security of every
            visitor, student, prospective student, and user ("you" or "your")
            who interacts with our website and services.
          </p>

          <p className="text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
            This page explains how we gather, use, share, and protect your
            information when you visit{" "}
            <a
              href="https://americantechgloballlc.com/"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline"
            >
              americantechgloballlc.com
            </a>{" "}
            and use our courses, training programs, and related services
            (together, the "Services").
          </p>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            By using our Website and Services, you accept the practices
            described below. If you disagree with any part of this policy,
            please stop using the Website and Services.
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

export default TermsAndConditions;