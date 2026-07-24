import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from "react-icons/fa";
import Newsletter from "./Newsletter";

const FOOTER_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Success Stories", to: "/success-stories" },
      { label: "Hiring Partners", to: "/hiring-partners" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Programs",
    links: [
      { label: "All Courses", to: "/courses" },
      { label: "Certifications", to: "/certifications" },
      { label: "Events", to: "/events" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", to: "/blog" },
      { label: "Gallery", to: "/gallery" },
      { label: "Testimonials", to: "/testimonials" },
    ],
  },
];

const SOCIALS = [
  { icon: FaFacebookF, href: "https://facebook.com" },
  { icon: FaTwitter, href: "https://twitter.com" },
  { icon: FaLinkedinIn, href: "https://linkedin.com" },
  { icon: FaInstagram, href: "https://instagram.com" },
  { icon: FaYoutube, href: "https://youtube.com" },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary-700 dark:text-primary-400">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">AT</span>
              American Tech
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-600 dark:text-slate-400">
              Career-focused technology training and placement programs, built to move students from classroom to career.
            </p>
            <div className="mt-5 flex gap-3">
              {SOCIALS.map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 transition-colors hover:bg-primary-600 hover:text-white dark:bg-slate-800 dark:text-slate-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-900 dark:text-white">
              Newsletter
            </h4>
            <Newsletter compact />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5 dark:border-slate-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 text-xs text-slate-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} American Tech. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/pages/privacy-policy" className="hover:text-primary-600">Privacy Policy</Link>
            <Link to="/pages/terms" className="hover:text-primary-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
