import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiMenu, HiX, HiChevronDown, HiMoon, HiSun } from "react-icons/hi";
import { AnimatePresence, motion } from "framer-motion";
import { toggleDarkMode, toggleMobileMenu, closeMobileMenu } from "../redux/slices/uiSlice";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  {
    label: "Courses",
    to: "/courses",
    children: [
      { label: "All Courses", to: "/courses" },
      { label: "Certifications", to: "/certifications" },
    ],
  },
  {
    label: "More",
    to: "/terms-and-conditions",
    children: [
      { label: "Terms & Conditions", to: "/terms-and-conditions" },
      { label: "Refund and Return Policy", to: "/refund-policy" },
      { label: "Cookies Policy", to: "/cookie-policy" },
    ],
  },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const { isMobileMenuOpen, isDarkMode } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [openMobileDropdown, setOpenMobileDropdown] = useState(null);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="container-page flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center">
          <img
            src="/static/images/logo.png"
            alt="American Futuretech LLC"
            className="h-10 w-auto object-contain sm:h-16"
          />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <li
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && setOpenDropdown(link.label)}
              onMouseLeave={() => link.children && setOpenDropdown(null)}
            >
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-slate-700 hover:text-primary-600 dark:text-slate-200 dark:hover:text-primary-400"
                  }`
                }
              >
                {link.label}
                {link.children && (
                  <HiChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${
                      openDropdown === link.label ? "rotate-180" : ""
                    }`}
                  />
                )}
              </NavLink>

              <AnimatePresence>
                {link.children && openDropdown === link.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full min-w-[220px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  >
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        to={child.to}
                        className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary-400"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>

        {/* Desktop right side */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* <button
            onClick={() => dispatch(toggleDarkMode())}
            aria-label="Toggle dark mode"
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isDarkMode ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
          </button> */}
          {isAuthenticated ? (
            <Link
              to={user?.role?.name === "Admin" ? "/admin" : "/dashboard"}
              className="btn-primary"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            onClick={() => dispatch(toggleDarkMode())}
            aria-label="Toggle dark mode"
            className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {isDarkMode ? <HiSun className="h-5 w-5" /> : <HiMoon className="h-5 w-5" />}
          </button>
          <button
            className="p-2 text-slate-700 dark:text-slate-200"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 lg:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <button
                      onClick={() =>
                        setOpenMobileDropdown(
                          openMobileDropdown === link.label ? null : link.label
                        )
                      }
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      {link.label}
                      <HiChevronDown
                        className={`h-4 w-4 transition-transform ${
                          openMobileDropdown === link.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence>
                      {openMobileDropdown === link.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden pl-3"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              to={child.to}
                              onClick={() => dispatch(closeMobileMenu())}
                              className="block rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.to}
                    onClick={() => dispatch(closeMobileMenu())}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    {link.label}
                  </Link>
                )
              )}

              <div className="mt-2 flex gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                {isAuthenticated ? (
                  <Link
                    to={user?.role?.name === "Admin" ? "/admin" : "/dashboard"}
                    className="btn-primary flex-1"
                    onClick={() => dispatch(closeMobileMenu())}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="btn-outline flex-1"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="btn-primary flex-1"
                      onClick={() => dispatch(closeMobileMenu())}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
