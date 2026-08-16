import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChevronDown, Mail, Cookie, Globe, Phone } from "lucide-react";
import PageHeader from "../components/PageHeader";

const sections = [
  {
    id: "what-are-cookies",
    title: "1. What Are Cookies?",
    content: (
      <>
        <p className="mb-4">
          Cookies are small text files stored on your computer, tablet, or
          mobile device when you visit a website. They help websites
          recognize users, remember preferences, and improve functionality.
        </p>
        <p className="mb-2">Cookies may be classified as:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>
            <strong>Session Cookies</strong> – Temporary cookies that expire
            when you close your browser.
          </li>
          <li>
            <strong>Persistent Cookies</strong> – Remain on your device until
            deleted or until they expire.
          </li>
          <li>
            <strong>First-Party Cookies</strong> – Set directly by our
            website.
          </li>
          <li>
            <strong>Third-Party Cookies</strong> – Set by external services
            we use.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "2. How We Use Cookies",
    content: (
      <>
        <p className="mb-4">
          American FutureTech LLC uses cookies for the following purposes:
        </p>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          A. Essential Cookies
        </h4>
        <p className="mb-4">
          These cookies are necessary for the website to function properly.
          They enable core features such as secure login, navigation, and
          access to protected areas. Without these cookies, certain services
          cannot be provided.
        </p>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          B. Performance & Analytics Cookies
        </h4>
        <p className="mb-2">
          These cookies help us understand how visitors interact with our
          website by collecting anonymous information such as:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Pages visited</li>
          <li>Time spent on pages</li>
          <li>Traffic sources</li>
          <li>Error messages</li>
        </ul>
        <p className="mb-4">
          This data helps us improve website performance and user experience.
        </p>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          C. Functional Cookies
        </h4>
        <p className="mb-2">
          These cookies allow us to remember your preferences, including:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Language settings</li>
          <li>Region</li>
          <li>Saved login details</li>
        </ul>
        <p className="mb-4">
          They provide a more personalized browsing experience.
        </p>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          D. Marketing & Advertising Cookies
        </h4>
        <p className="mb-2">These cookies may be used to:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Deliver relevant advertisements</li>
          <li>Measure marketing campaign performance</li>
          <li>Track user behavior across websites</li>
        </ul>
        <p>
          Third-party service providers may place these cookies on our
          behalf.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "3. Third-Party Cookies",
    content: (
      <>
        <p className="mb-2">
          We may use trusted third-party services such as:
        </p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Website analytics providers</li>
          <li>Payment processors</li>
          <li>Learning management systems</li>
          <li>Advertising platforms</li>
        </ul>
        <p>
          These third parties may use cookies in accordance with their own
          privacy policies. We do not control third-party cookies directly.
        </p>
      </>
    ),
  },
  {
    id: "your-choices",
    title: "4. Your Cookie Choices",
    content: (
      <>
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Browser Settings
        </h4>
        <p className="mb-2">Most web browsers allow you to:</p>
        <ul className="list-disc pl-6 space-y-1 mb-4">
          <li>Delete existing cookies</li>
          <li>Block all cookies</li>
          <li>Block specific cookies</li>
          <li>Receive notifications before cookies are stored</li>
        </ul>
        <p className="mb-4">
          Please note that disabling certain cookies may affect website
          functionality.
        </p>

        <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
          Cookie Consent Banner
        </h4>
        <p>
          When you visit our website, you may see a cookie consent banner
          that allows you to accept or manage your cookie preferences.
        </p>
      </>
    ),
  },
  {
    id: "data-protection",
    title: "5. Data Protection & Privacy",
    content: (
      <>
        <p className="mb-4">
          Cookies may collect information that can be considered personal
          data. For more details on how we collect, use, and protect your
          data, please review our Privacy Policy.
        </p>
        <p>
          We implement appropriate technical and organizational measures to
          safeguard your information.
        </p>
      </>
    ),
  },
  {
    id: "updates",
    title: "6. Updates to This Cookies Policy",
    content: (
      <p>
        We may update this Cookies Policy from time to time to reflect
        changes in legal requirements or our practices. Updates will be
        posted on this page with a revised effective date.
      </p>
    ),
  },
  {
    id: "contact",
    title: "7. Contact Us",
    content: (
      <>
        <p className="mb-4">
          If you have any questions about this Cookies Policy or how we use
          cookies, please contact:
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
            <Phone size={16} /> +1 (660) 310-8528

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

const CookiePolicy = () => {
  const [openId, setOpenId] = useState(sections[0].id);

  const toggleSection = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <Helmet>
        <title>Cookies Policy | American FutureTech</title>
      </Helmet>
      <PageHeader
        title="Cookies Policy"
        breadcrumbItems={[{ label: "Cookies Policy" }]}
      />

      <section className="container-page max-w-7xl py-16">
        {/* Intro card */}
        <div className="mb-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-primary/5 to-transparent p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
              <Cookie size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
              Cookies Policy
            </h1>
          </div>

          <p className="text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
            <strong>American FutureTech LLC</strong> ("we," "our," or "us")
            uses cookies and similar tracking technologies on our website to
            enhance user experience, analyze website performance, and support
            our marketing activities.
          </p>

          <p className="text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
            This Cookies Policy explains what cookies are, how we use them,
            and your choices regarding their use.
          </p>

          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            By continuing to use our website, you agree to the use of cookies
            in accordance with this policy.
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

export default CookiePolicy;