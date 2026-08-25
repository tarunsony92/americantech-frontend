import { useEffect, useMemo, useState } from "react";
import {
  Outlet,
  Link,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineUserCircle,
  HiOutlineBadgeCheck,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineQuestionMarkCircle,
  HiOutlineSupport,
} from "react-icons/hi";

import {
  logoutUser,
  fetchProfile,
} from "../redux/slices/authSlice";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);

  const isAuthenticated = useSelector(
    (state) => state.auth.isAuthenticated
  );

  // =====================================================
  // FETCH USER PROFILE
  // =====================================================
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated, user]);

  // =====================================================
  // USER NAME
  // =====================================================
  const userName = useMemo(() => {
    if (!user) return "Student";

    if (user.fullName) return user.fullName;
    if (user.name) return user.name;
    if (user.full_name) return user.full_name;
    if (user.username) return user.username;

    const firstName =
      user.firstName ||
      user.first_name ||
      "";

    const lastName =
      user.lastName ||
      user.last_name ||
      "";

    return (
      `${firstName} ${lastName}`.trim() ||
      "Student"
    );
  }, [user]);

  // =====================================================
  // USER INITIALS
  // =====================================================
  const initials = useMemo(() => {
    const parts = userName
      .split(" ")
      .filter(Boolean);

    if (!parts.length) {
      return "S";
    }

    if (parts.length === 1) {
      return parts[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }, [userName]);

  // =====================================================
  // NAVIGATION
  // =====================================================
  const NAV_ITEMS = [
    {
      label: "Overview",
      to: "/dashboard",
      icon: HiOutlineHome,
      end: true,
    },
    {
      label: "My Courses",
      to: "/dashboard/courses",
      icon: HiOutlineBookOpen,
    },
    {
      label: "Certificates",
      to: "/dashboard/certificates",
      icon: HiOutlineBadgeCheck,
    },
    {
      label: "Profile",
      to: "/dashboard/profile",
      icon: HiOutlineUserCircle,
    },
  ];

  // =====================================================
  // LOGOUT
  // =====================================================
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login", {
        replace: true,
      });
    }
  };

  // =====================================================
  // CURRENT PAGE
  // =====================================================
  const currentLabel =
    NAV_ITEMS.find((item) =>
      item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to)
    )?.label || "Overview";

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* =====================================================
          HIDE SIDEBAR SCROLLBAR
      ====================================================== */}
      <style>{`
        .sidebar-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .sidebar-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }
      `}</style>

      {/* =====================================================
          MAIN APP
      ====================================================== */}
      <div className="min-h-screen bg-[#F5F7FA] text-slate-900">

        {/* =====================================================
            TOP HEADER
        ====================================================== */}
        <header className="sticky top-0 z-50 h-[76px] border-b border-slate-200 bg-white">

          <div className="mx-auto flex h-full w-full max-w-[1600px] items-center px-4 sm:px-6 lg:px-8">

            {/* =================================================
                BRAND
            ================================================== */}
            <div className="flex min-w-0 items-center gap-3 lg:w-[270px]">

              {/* Mobile menu */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
                aria-label="Open menu"
              >
                <HiOutlineMenu className="h-5 w-5" />
              </button>

              {/* Logo */}
              <Link
                to="/dashboard"
                className="flex min-w-0 items-center gap-3"
              >
                <div className="flex h-12 w-[170px] shrink-0 items-center overflow-hidden rounded-lg bg-white">
                  <img
                    src="/static/images/logoamerican.jpeg"
                    alt="American FutureTech LLC"
                    className="h-full w-full object-contain"
                  />
                </div>
              </Link>

            </div>

            {/* =================================================
                SEARCH
            ================================================== */}
            <div className="mx-auto hidden max-w-[650px] flex-1 px-8 md:block">

              <div className="relative">

                <HiOutlineSearch
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    h-5
                    w-5
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="search"
                  placeholder="Search for lessons, modules, topics..."
                  className="
                    h-11
                    w-full
                    rounded-full
                    border
                    border-slate-200
                    bg-slate-50
                    pl-11
                    pr-12
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-primary-400
                    focus:bg-white
                    focus:ring-4
                    focus:ring-primary-500/10
                  "
                />

                <span
                  className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    text-slate-400
                  "
                >
                  <HiOutlineSearch className="h-4 w-4" />
                </span>

              </div>

            </div>

            {/* =================================================
                HEADER ACTIONS
            ================================================== */}
            <div className="ml-auto flex items-center gap-2 sm:gap-4">

              {/* Notifications */}
              <button
                type="button"
                className="
                  relative
                  hidden
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  sm:flex
                "
                aria-label="Notifications"
              >
                <HiOutlineBell className="h-5 w-5" />

                <span
                  className="
                    absolute
                    right-1.5
                    top-1.5
                    flex
                    h-4
                    min-w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1
                    text-[9px]
                    font-bold
                    text-white
                  "
                >
                  3
                </span>
              </button>

              {/* Certificates */}
              <Link
                to="/dashboard/certificates"
                className="
                  hidden
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-slate-600
                  transition
                  hover:bg-slate-50
                  sm:flex
                "
                aria-label="Certificates"
              >
                <HiOutlineBadgeCheck className="h-5 w-5" />
              </Link>

              <div className="hidden h-7 w-px bg-slate-200 sm:block" />

              {/* User */}
              <Link
                to="/dashboard/profile"
                className="
                  group
                  flex
                  items-center
                  gap-2.5
                  rounded-xl
                  px-1.5
                  py-1
                  transition
                  hover:bg-slate-50
                "
              >

                {/* Avatar */}
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#10264A]
                    text-xs
                    font-bold
                    text-white
                    ring-2
                    ring-slate-100
                  "
                >
                  {initials}
                </div>

                {/* User info */}
                <div className="hidden text-right sm:block">

                  <p className="max-w-[150px] truncate text-sm font-bold text-slate-800">
                    {userName}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Student
                  </p>

                </div>

                <HiOutlineChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />

              </Link>

            </div>

          </div>
        </header>

        {/* =====================================================
            MOBILE DRAWER
        ====================================================== */}
        {mobileOpen && (
          <>
            {/* Overlay */}
            <div
              className="
                fixed
                inset-0
                z-[60]
                bg-slate-950/40
                backdrop-blur-[2px]
                lg:hidden
              "
              onClick={closeMobileMenu}
            />

            {/* Drawer */}
            <aside
              className="
                fixed
                inset-y-0
                left-0
                z-[70]
                flex
                w-[285px]
                flex-col
                bg-[#10264A]
                text-white
                shadow-2xl
                lg:hidden
              "
            >

              {/* Drawer header */}
              <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-[130px] items-center overflow-hidden rounded-lg bg-white">
                    <img
                      src="/static/images/logoamerican.jpeg"
                      alt="American FutureTech"
                      className="h-full w-full object-contain"
                    />
                  </div>

                </div>

                <button
                  type="button"
                  onClick={closeMobileMenu}
                  className="
                    rounded-lg
                    p-2
                    text-white/60
                    hover:bg-white/10
                    hover:text-white
                  "
                  aria-label="Close menu"
                >
                  <HiOutlineX className="h-5 w-5" />
                </button>

              </div>

              {/* Mobile nav */}
              <div className="sidebar-scroll flex-1 overflow-y-auto px-4 py-5">

                <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                  Learning
                </p>

                <SidebarNavigation
                  items={NAV_ITEMS}
                  mobile
                  onNavigate={closeMobileMenu}
                />

              </div>

              {/* Mobile logout */}
              <div className="border-t border-white/10 p-4">

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-medium
                    text-white/70
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <HiOutlineLogout className="h-5 w-5" />
                  Logout
                </button>

              </div>

            </aside>
          </>
        )}

        {/* =====================================================
            PAGE SHELL
        ====================================================== */}
        <div
          className="
            mx-auto
            w-full
            max-w-[1600px]
            px-3
            py-4
            sm:px-5
            sm:py-5
            lg:px-6
            lg:pl-[270px]
          "
        >

          {/* =================================================
              FIXED DESKTOP SIDEBAR
          ================================================== */}
          <aside
            className="
              fixed
              left-[max(12px,calc((100vw-1600px)/2+24px))]
              top-[92px]
              z-40
              hidden
              h-[calc(100vh-108px)]
              w-[250px]
              overflow-hidden
              rounded-2xl
              bg-[#10264A]
              text-white
              shadow-[0_15px_40px_-22px_rgba(16,38,74,0.7)]
              lg:flex
              lg:flex-col
            "
          >

            {/* =================================================
                SIDEBAR PROFILE
            ================================================== */}
            <div className="border-b border-white/10 p-5">

              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-white/10
                    text-sm
                    font-bold
                    ring-1
                    ring-white/10
                  "
                >
                  {initials}
                </div>

                <div className="min-w-0">

                  <p className="truncate text-sm font-bold text-white">
                    {userName}
                  </p>

                  <p className="truncate text-[11px] text-white/45">
                    {user?.email || "Student Account"}
                  </p>

                </div>

              </div>

            </div>

            {/* =================================================
                NAVIGATION
            ================================================== */}
            <div className="sidebar-scroll flex-1 overflow-y-auto px-3 py-5">

              <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
                Learning
              </p>

              <SidebarNavigation
                items={NAV_ITEMS}
              />

            </div>

            {/* =================================================
                HELP
            ================================================== */}
            <div className="p-3">

              <div
                className="
                  relative
                  overflow-hidden
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.045]
                  p-4
                "
              >

                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/[0.035]" />

                <div className="relative">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                    <HiOutlineSupport className="h-5 w-5 text-white/80" />
                  </div>

                  <p className="mt-3 text-sm font-bold text-white">
                    Need Help?
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-white/45">
                    Connect with our support team.
                  </p>

                  <button
                    type="button"
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-2
                      rounded-lg
                      border
                      border-white/15
                      bg-white/[0.06]
                      px-3
                      py-2
                      text-[11px]
                      font-semibold
                      text-white
                      transition
                      hover:bg-white/10
                    "
                  >
                    <HiOutlineQuestionMarkCircle className="h-4 w-4" />
                    Contact Support
                  </button>

                </div>

              </div>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="
                  mt-2
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-sm
                  font-medium
                  text-white/55
                  transition
                  hover:bg-white/[0.06]
                  hover:text-white
                "
              >
                <HiOutlineLogout className="h-5 w-5" />
                Logout
              </button>

            </div>

          </aside>

          {/* =================================================
              MAIN CONTENT
          ================================================== */}
          <main
            className="
              min-w-0
              w-full
              rounded-2xl
              bg-white
              p-4
              shadow-[0_10px_35px_-24px_rgba(15,23,42,0.35)]
              sm:p-6
              lg:p-7
            "
          >

            {/* =================================================
                PAGE HEADING
            ================================================== */}
            <div
              className="
                mb-6
                flex
                items-end
                justify-between
                border-b
                border-slate-100
                pb-5
              "
            >

              <div>

                <div
                  className="
                    mb-1.5
                    flex
                    items-center
                    gap-1.5
                    text-xs
                    text-slate-400
                  "
                >
                  <span>
                    Dashboard
                  </span>

                  <HiOutlineChevronRight className="h-3 w-3" />

                  <span className="font-semibold text-primary-600">
                    {currentLabel}
                  </span>
                </div>

                <h1
                  className="
                    text-2xl
                    font-bold
                    tracking-[-0.025em]
                    text-[#10264A]
                  "
                >
                  {currentLabel}
                </h1>

              </div>

              <div
                className="
                  hidden
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-slate-200
                  px-3
                  py-2
                  sm:flex
                "
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                <span className="text-xs font-semibold text-slate-500">
                  Learning
                </span>
              </div>

            </div>

            {/* =================================================
                PAGE CONTENT
            ================================================== */}
            <div className="min-w-0">
              <Outlet />
            </div>

          </main>

        </div>

      </div>
    </>
  );
};

/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

const SidebarNavigation = ({
  items,
  mobile = false,
  onNavigate,
}) => {
  return (
    <nav className="space-y-1">

      {items.map((item) => {
        const Icon = item.icon;

        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                "group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200",

                isActive
                  ? "bg-primary-600 text-white shadow-[0_8px_20px_-10px_rgba(37,99,235,0.8)]"
                  : "text-white/65 hover:bg-white/[0.07] hover:text-white",

                mobile ? "w-full" : "",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={[
                    "h-5 w-5 shrink-0",

                    isActive
                      ? "text-white"
                      : "text-white/55 group-hover:text-white",
                  ].join(" ")}
                />

                <span className="flex-1">
                  {item.label}
                </span>

                {isActive && (
                  <HiOutlineChevronRight className="h-4 w-4 text-white/70" />
                )}
              </>
            )}
          </NavLink>
        );
      })}

    </nav>
  );
};

export default DashboardLayout;