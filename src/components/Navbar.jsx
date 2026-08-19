import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  HiMenu,
  HiX,
  HiChevronDown,
} from "react-icons/hi";
import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  toggleDarkMode,
  toggleMobileMenu,
  closeMobileMenu,
} from "../redux/slices/uiSlice";


const NAV_LINKS = [
  {
    label: "Home",
    to: "/",
  },

  {
    label: "Live Jobs",
    to: "/jobscourse",
  },

  {
    label: "Courses",
    to: "/courses",
    children: [
      {
        label: "All Courses",
        to: "/courses",
      },
      {
        label: "Certifications",
        to: "/certifications",
      },
    ],
  },

  {
    label: "About Us",
    to: "/about",
  },

  {
    label: "Contact",
    to: "/contact",
  },

  {
    label: "More",
    to: "/terms-and-conditions",
    children: [
      {
        label: "Privacy Policy",
        to: "/terms-and-conditions",
      },
      {
        label: "Refund and Return Policy",
        to: "/refund-policy",
      },
      {
        label: "Cookies Policy",
        to: "/cookie-policy",
      },
    ],
  },
];


const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -10,
    scale: 0.96,
    filter: "blur(5px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1],
    },
  },

  exit: {
    opacity: 0,
    y: -8,
    scale: 0.97,
    filter: "blur(4px)",
    transition: {
      duration: 0.18,
      ease: "easeIn",
    },
  },
};


const dropdownItemVariants = {
  hidden: {
    opacity: 0,
    x: -8,
  },

  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.045,
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};


const mobileMenuVariants = {
  hidden: {
    height: 0,
    opacity: 0,
  },

  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      },

      opacity: {
        duration: 0.2,
      },
    },
  },

  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration: 0.28,
        ease: [0.7, 0, 0.84, 0],
      },

      opacity: {
        duration: 0.15,
      },
    },
  },
};


const mobileItemVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },

  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: index * 0.045,
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};


const Navbar = () => {
  const dispatch = useDispatch();

  const {
    isMobileMenuOpen,
    isDarkMode,
  } = useSelector(
    (state) => state.ui
  );

  const {
    isAuthenticated,
    user,
  } = useSelector(
    (state) => state.auth
  );

  const [openDropdown, setOpenDropdown] =
    useState(null);

  const [openMobileDropdown, setOpenMobileDropdown] =
    useState(null);


  return (
    <>
      <header
        className="
          sticky top-0 z-50
          w-full
          border-b border-slate-200/70
          bg-white
          backdrop-blur-2xl

          dark:border-slate-800/70
          dark:bg-slate-950/85

          transition-all duration-500
        "
      >

        {/* ===============================
            TOP AMBIENT GLOW
        =============================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-x-0
            -bottom-10
            mx-auto
            h-16
            max-w-4xl
            rounded-full
            bg-primary/10
            blur-3xl
            opacity-60
            dark:bg-primary/15
          "
        />


        {/* ===============================
            NAVBAR CONTENT
        =============================== */}

        <nav
          className="
            container-page
            relative
            flex
            h-16
            items-center
            justify-between
          "
        >

          {/* ===============================
              LOGO
          =============================== */}

          <Link
            to="/"
            className="
              group
              relative
              flex
              items-center
              shrink-0
            "
          >

            {/* Logo glow */}

            <span
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-2xl
                bg-primary/20
                opacity-0
                blur-xl
                transition-all
                duration-500

                group-hover:opacity-100
                group-hover:scale-110
              "
            />

           <motion.span
  initial={{
    opacity: 0,
    x: -15,
    y: 8,
    scale: 0.95,
  }}

  animate={{
    opacity: 1,
    x: 0,
    y: [0, -4, 0, 4, 0],
    scale: [1, 1.015, 1, 1.01, 1],
    rotate: [0, 0.6, 0, -0.6, 0],
  }}

  transition={{
    opacity: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },

    x: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },

    y: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },

    scale: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    },

    rotate: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }}

  whileHover={{
    scale: 1.06,
    rotate: 1.5,
    y: -3,
  }}

  whileTap={{
    scale: 0.96,
  }}

  className="
    relative
    flex
    items-center
    justify-center
    overflow-hidden
    rounded-xl

    h-10
    w-28

    sm:h-12
    sm:w-40

    lg:h-14
    lg:w-52

    will-change-transform

    transition-all
    duration-300
  "
>
  <img
    src="/static/images/logoamerican.jpeg"
    alt="American FutureTech"
    className="
      h-full
      w-full
      object-contain

      transition-transform
      duration-500

      group-hover:scale-[1.03]
    "
  />
</motion.span>
          </Link>


          {/* ===============================
              DESKTOP NAVIGATION
          =============================== */}

          <motion.ul
            initial={{
              opacity: 0,
              y: -8,
            }}

            animate={{
              opacity: 1,
              y: 0,
            }}

            transition={{
              duration: 0.55,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}

            className="
              hidden
              items-center
              gap-1
              lg:flex
            "
          >

            {NAV_LINKS.map(
              (link, index) => (
                <motion.li
                  key={link.label}
                  custom={index}
                  initial={{
                    opacity: 0,
                    y: -8,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay:
                      0.08 +
                      index * 0.055,
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}

                  className="
                    relative
                    group/nav
                  "

                  onMouseEnter={() =>
                    link.children &&
                    setOpenDropdown(
                      link.label
                    )
                  }

                  onMouseLeave={() =>
                    link.children &&
                    setOpenDropdown(null)
                  }
                >

                  <NavLink
                    to={link.to}
                    className={({
                      isActive,
                    }) =>
                      `
                        relative
                        flex
                        items-center
                        gap-1.5
                        rounded-xl
                        px-3.5
                        py-2.5
                        text-sm
                        font-semibold

                        transition-all
                        duration-300

                        ${
                          isActive
                            ? `
                              text-primary-600
                              dark:text-primary-400
                            `
                            : `
                              text-slate-700
                              dark:text-slate-200

                              hover:text-primary-600
                              dark:hover:text-primary-400
                            `
                        }
                      `
                    }
                  >

                    {({
                      isActive,
                    }) => (
                      <>
                        {/* Hover background */}

                        <motion.span
                          aria-hidden="true"
                          className="
                            pointer-events-none
                            absolute
                            inset-0
                            rounded-xl
                            bg-slate-100/80
                            dark:bg-slate-800/70
                          "

                          initial={{
                            opacity: 0,
                            scale: 0.85,
                          }}

                          whileHover={{
                            opacity: 1,
                            scale: 1,
                          }}

                          transition={{
                            duration: 0.2,
                          }}
                        />


                        {/* Active animated pill */}

                        {isActive && (
                          <motion.span
                            layoutId="activeNavItem"
                            className="
                              absolute
                              inset-0
                              -z-0
                              rounded-xl
                              bg-primary/10
                              ring-1
                              ring-primary/15
                              dark:bg-primary/15
                            "

                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}


                        {/* Text */}

                        <span
                          className="
                            relative
                            z-10
                          "
                        >
                          {link.label}
                        </span>


                        {/* Chevron */}

                        {link.children && (
                          <motion.span
                            className="
                              relative
                              z-10
                              flex
                            "

                            animate={{
                              rotate:
                                openDropdown ===
                                link.label
                                  ? 180
                                  : 0,
                            }}

                            transition={{
                              duration: 0.25,
                              ease: "easeOut",
                            }}
                          >
                            <HiChevronDown
                              className="
                                h-4
                                w-4
                              "
                            />
                          </motion.span>
                        )}
                      </>
                    )}

                  </NavLink>


                  {/* ===============================
                      DESKTOP DROPDOWN
                  =============================== */}

                  <AnimatePresence>
                    {link.children &&
                      openDropdown ===
                        link.label && (

                        <motion.div
                          variants={
                            dropdownVariants
                          }

                          initial="hidden"
                          animate="visible"
                          exit="exit"

                          className="
                            absolute
                            left-1/2
                            top-[calc(100%+10px)]
                            z-50
                            w-[245px]
                            -translate-x-1/2

                            rounded-2xl

                            border
                            border-slate-200/80

                            bg-white/95
                            p-2

                            shadow-2xl
                            shadow-slate-900/10

                            backdrop-blur-2xl

                            dark:border-slate-700/80
                            dark:bg-slate-900/95
                            dark:shadow-black/30
                          "
                        >

                          {/* Dropdown top glow */}

                          <span
                            className="
                              pointer-events-none
                              absolute
                              -top-5
                              left-1/2
                              h-10
                              w-32
                              -translate-x-1/2
                              rounded-full
                              bg-primary/20
                              blur-2xl
                            "
                          />


                          {/* Small arrow */}

                          <span
                            className="
                              absolute
                              -top-1.5
                              left-1/2
                              h-3
                              w-3
                              -translate-x-1/2
                              rotate-45

                              border-l
                              border-t
                              border-slate-200/80

                              bg-white/95

                              dark:border-slate-700/80
                              dark:bg-slate-900
                            "
                          />


                          <div
                            className="
                              relative
                              space-y-1
                            "
                          >

                            {link.children.map(
                              (
                                child,
                                childIndex
                              ) => (
                                <motion.div
                                  key={
                                    child.label
                                  }

                                  custom={
                                    childIndex
                                  }

                                  variants={
                                    dropdownItemVariants
                                  }

                                  initial="hidden"
                                  animate="visible"

                                  whileHover={{
                                    x: 4,
                                  }}

                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                  }}
                                >

                                  <Link
                                    to={child.to}
                                    className="
                                      group/drop
                                      relative
                                      flex
                                      items-center
                                      overflow-hidden
                                      rounded-xl
                                      px-4
                                      py-3

                                      text-sm
                                      font-medium
                                      text-slate-700

                                      transition-all
                                      duration-300

                                      hover:bg-primary/10
                                      hover:text-primary-700

                                      dark:text-slate-200
                                      dark:hover:bg-primary/10
                                      dark:hover:text-primary-400
                                    "
                                  >

                                    {/* Hover sweep */}

                                    <span
                                      className="
                                        pointer-events-none
                                        absolute
                                        inset-y-0
                                        -left-full
                                        w-1/2
                                        skew-x-[-20deg]
                                        bg-gradient-to-r
                                        from-transparent
                                        via-white/30
                                        to-transparent

                                        transition-all
                                        duration-700

                                        group-hover/drop:left-[130%]
                                      "
                                    />


                                    {/* Dot */}

                                    <span
                                      className="
                                        mr-3
                                        h-1.5
                                        w-1.5
                                        shrink-0
                                        rounded-full
                                        bg-primary/40

                                        transition-all
                                        duration-300

                                        group-hover/drop:scale-150
                                        group-hover/drop:bg-primary
                                      "
                                    />

                                    <span
                                      className="
                                        relative
                                      "
                                    >
                                      {
                                        child.label
                                      }
                                    </span>

                                  </Link>

                                </motion.div>
                              )
                            )}

                          </div>

                        </motion.div>
                      )}
                  </AnimatePresence>

                </motion.li>
              )
            )}

          </motion.ul>


          {/* ===============================
              DESKTOP RIGHT
          =============================== */}

          <motion.div
            initial={{
              opacity: 0,
              x: 15,
            }}

            animate={{
              opacity: 1,
              x: 0,
            }}

            transition={{
              duration: 0.45,
              delay: 0.35,
            }}

            className="
              hidden
              items-center
              gap-3
              lg:flex
            "
          >

            {/* Optional auth area */}

            {isAuthenticated && (
              <motion.div
                whileHover={{
                  y: -2,
                }}

                whileTap={{
                  scale: 0.97,
                }}
              >
                <Link
                  to={
                    user?.role?.name ===
                    "Admin"
                      ? "/admin"
                      : "/dashboard"
                  }

                  className="
                    relative
                    inline-flex
                    items-center
                    overflow-hidden
                    rounded-full

                    bg-primary
                    px-5
                    py-2.5

                    text-sm
                    font-bold
                    text-black

                    shadow-lg
                    shadow-primary/20

                    transition-all
                    duration-300

                    hover:shadow-xl
                    hover:shadow-primary/30
                  "
                >

                  <span
                    className="
                      absolute
                      inset-0
                      -translate-x-full
                      bg-white/25
                      skew-x-[-20deg]

                      transition-transform
                      duration-700

                      hover:translate-x-[130%]
                    "
                  />

                  <span className="relative">
                    Dashboard
                  </span>

                </Link>
              </motion.div>
            )}

          </motion.div>


          {/* ===============================
              MOBILE BUTTON
          =============================== */}

          <div
            className="
              flex
              items-center
              lg:hidden
            "
          >

            <motion.button
              whileTap={{
                scale: 0.88,
                rotate: 3,
              }}

              whileHover={{
                scale: 1.05,
              }}

              className="
                relative
                flex
                h-11
                w-11
                items-center
                justify-center
                overflow-hidden
                rounded-xl

                border
                border-slate-200

                bg-slate-50

                text-slate-700

                shadow-sm

                transition-all
                duration-300

                hover:border-primary/30
                hover:text-primary

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-200
              "

              onClick={() =>
                dispatch(
                  toggleMobileMenu()
                )
              }

              aria-label="Toggle menu"
            >

              <AnimatePresence
                mode="wait"
                initial={false}
              >

                {isMobileMenuOpen ? (
                  <motion.span
                    key="close"
                    initial={{
                      opacity: 0,
                      rotate: -90,
                      scale: 0.6,
                    }}

                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}

                    exit={{
                      opacity: 0,
                      rotate: 90,
                      scale: 0.6,
                    }}

                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <HiX
                      className="
                        h-6
                        w-6
                      "
                    />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{
                      opacity: 0,
                      rotate: 90,
                      scale: 0.6,
                    }}

                    animate={{
                      opacity: 1,
                      rotate: 0,
                      scale: 1,
                    }}

                    exit={{
                      opacity: 0,
                      rotate: -90,
                      scale: 0.6,
                    }}

                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <HiMenu
                      className="
                        h-6
                        w-6
                      "
                    />
                  </motion.span>
                )}

              </AnimatePresence>

            </motion.button>

          </div>

        </nav>


        {/* ===============================
            MOBILE MENU
        =============================== */}

        <AnimatePresence>
          {isMobileMenuOpen && (

            <motion.div
              variants={
                mobileMenuVariants
              }

              initial="hidden"
              animate="visible"
              exit="exit"

              className="
                overflow-hidden

                border-t
                border-slate-200/70

                bg-white/95
                backdrop-blur-2xl

                dark:border-slate-800/70
                dark:bg-slate-950/95

                lg:hidden
              "
            >

              <div
                className="
                  container-page
                  relative
                  flex
                  flex-col
                  gap-1
                  py-4
                  pb-6
                "
              >

                {/* Mobile glow */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    top-0
                    h-40
                    w-40
                    rounded-full
                    bg-primary/10
                    blur-3xl
                  "
                />


                {NAV_LINKS.map(
                  (link, index) => {

                    if (link.children) {
                      return (
                        <motion.div
                          key={
                            link.label
                          }

                          custom={index}
                          variants={
                            mobileItemVariants
                          }

                          initial="hidden"
                          animate="visible"

                          className="
                            relative
                          "
                        >

                          <button
                            onClick={() =>
                              setOpenMobileDropdown(
                                openMobileDropdown ===
                                  link.label
                                  ? null
                                  : link.label
                              )
                            }

                            className="
                              group
                              flex
                              w-full
                              items-center
                              justify-between

                              rounded-xl
                              px-4
                              py-3

                              text-sm
                              font-semibold

                              text-slate-700

                              transition-all
                              duration-300

                              hover:bg-primary/10
                              hover:text-primary

                              dark:text-slate-200
                              dark:hover:bg-primary/10
                            "
                          >

                            <span>
                              {link.label}
                            </span>

                            <motion.span
                              animate={{
                                rotate:
                                  openMobileDropdown ===
                                  link.label
                                    ? 180
                                    : 0,
                              }}

                              transition={{
                                duration: 0.25,
                              }}
                            >
                              <HiChevronDown
                                className="
                                  h-5
                                  w-5
                                "
                              />
                            </motion.span>

                          </button>


                          <AnimatePresence>
                            {openMobileDropdown ===
                              link.label && (

                              <motion.div
                                initial={{
                                  height: 0,
                                  opacity: 0,
                                }}

                                animate={{
                                  height: "auto",
                                  opacity: 1,
                                }}

                                exit={{
                                  height: 0,
                                  opacity: 0,
                                }}

                                transition={{
                                  duration: 0.28,
                                  ease: [
                                    0.16,
                                    1,
                                    0.3,
                                    1,
                                  ],
                                }}

                                className="
                                  overflow-hidden
                                  pl-3
                                "
                              >

                                <div
                                  className="
                                    ml-3
                                    border-l
                                    border-primary/20
                                    py-1
                                  "
                                >

                                  {link.children.map(
                                    (
                                      child,
                                      childIndex
                                    ) => (

                                      <motion.div
                                        key={
                                          child.label
                                        }

                                        initial={{
                                          opacity: 0,
                                          x: -10,
                                        }}

                                        animate={{
                                          opacity: 1,
                                          x: 0,
                                        }}

                                        transition={{
                                          delay:
                                            childIndex *
                                            0.06,
                                          duration:
                                            0.25,
                                        }}
                                      >

                                        <Link
                                          to={
                                            child.to
                                          }

                                          onClick={() =>
                                            dispatch(
                                              closeMobileMenu()
                                            )
                                          }

                                          className="
                                            group
                                            flex
                                            items-center
                                            gap-3

                                            rounded-lg
                                            px-4
                                            py-2.5

                                            text-sm
                                            text-slate-600

                                            transition-all
                                            duration-300

                                            hover:translate-x-1
                                            hover:bg-primary/10
                                            hover:text-primary

                                            dark:text-slate-300
                                          "
                                        >

                                          <span
                                            className="
                                              h-1.5
                                              w-1.5
                                              rounded-full
                                              bg-primary/40

                                              transition-all
                                              duration-300

                                              group-hover:scale-150
                                              group-hover:bg-primary
                                            "
                                          />

                                          {
                                            child.label
                                          }

                                        </Link>

                                      </motion.div>
                                    )
                                  )}

                                </div>

                              </motion.div>
                            )}
                          </AnimatePresence>

                        </motion.div>
                      );
                    }


                    return (
                      <motion.div
                        key={link.label}
                        custom={index}
                        variants={
                          mobileItemVariants
                        }

                        initial="hidden"
                        animate="visible"
                      >

                        <Link
                          to={link.to}

                          onClick={() =>
                            dispatch(
                              closeMobileMenu()
                            )
                          }

                          className="
                            group
                            relative
                            flex
                            items-center
                            overflow-hidden

                            rounded-xl
                            px-4
                            py-3

                            text-sm
                            font-semibold

                            text-slate-700

                            transition-all
                            duration-300

                            hover:translate-x-1
                            hover:bg-primary/10
                            hover:text-primary

                            dark:text-slate-200
                          "
                        >

                          {/* Hover line */}

                          <span
                            className="
                              absolute
                              left-0
                              top-1/2
                              h-0
                              w-1
                              -translate-y-1/2
                              rounded-full
                              bg-primary

                              transition-all
                              duration-300

                              group-hover:h-6
                            "
                          />

                          <span>
                            {link.label}
                          </span>

                        </Link>

                      </motion.div>
                    );
                  }
                )}


                {/* ===============================
                    MOBILE FOOTER AREA
                =============================== */}

                <motion.div
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}

                  animate={{
                    opacity: 1,
                    y: 0,
                  }}

                  transition={{
                    delay: 0.3,
                    duration: 0.3,
                  }}

                  className="
                    mt-3
                    border-t
                    border-slate-200
                    pt-4

                    dark:border-slate-800
                  "
                >

                  {isAuthenticated && (
                    <Link
                      to={
                        user?.role?.name ===
                        "Admin"
                          ? "/admin"
                          : "/dashboard"
                      }

                      onClick={() =>
                        dispatch(
                          closeMobileMenu()
                        )
                      }

                      className="
                        flex
                        items-center
                        justify-center

                        rounded-xl
                        bg-primary
                        px-4
                        py-3

                        text-sm
                        font-bold
                        text-black

                        shadow-lg
                        shadow-primary/20

                        transition-all
                        duration-300

                        hover:-translate-y-0.5
                        hover:shadow-xl
                      "
                    >
                      Dashboard
                    </Link>
                  )}

                </motion.div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </header>


      {/* ===============================
          NAVBAR ANIMATION CSS
      =============================== */}

      <style>{`

        /* ---------------------------------
           Premium nav glow
        --------------------------------- */

        @keyframes navbar-glow {

          0%,
          100% {
            opacity: 0.35;
            transform: scaleX(0.8);
          }

          50% {
            opacity: 0.7;
            transform: scaleX(1);
          }

        }


        /* ---------------------------------
           Shimmer
        --------------------------------- */

        @keyframes navbar-shimmer {

          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(220%);
          }

        }


        /* ---------------------------------
           Reduced motion
        --------------------------------- */

        @media (prefers-reduced-motion: reduce) {

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }

        }

      `}</style>

    </>
  );
};


export default Navbar;