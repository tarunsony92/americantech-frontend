import { Outlet, Link } from "react-router-dom";
import {
  HiOutlineAcademicCap,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineBookOpen,
} from "react-icons/hi";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">

        {/* =====================================================
            LEFT BRAND PANEL
        ====================================================== */}
        <section className="relative hidden overflow-hidden bg-[#141E32] lg:flex">

          {/* Decorative background */}
          <div className="absolute -left-32 -top-32 h-[420px] w-[420px] rounded-full bg-primary-600/10" />

          <div className="absolute -bottom-40 -right-32 h-[500px] w-[500px] rounded-full bg-primary-600/10" />

          <div className="absolute right-24 top-28 h-2 w-2 rounded-full bg-primary-300/50" />

          <div className="absolute left-24 bottom-32 h-1.5 w-1.5 rounded-full bg-white/20" />

          <div className="relative z-10 flex w-full items-center justify-center p-10 xl:p-16">

            <div className="w-full max-w-xl">

              {/* Logo */}
              <Link
                to="/"
                className="inline-flex items-center"
              >
                <div className="flex h-16 w-[210px] items-center overflow-hidden rounded-xl bg-white p-2 shadow-xl shadow-black/10">

                  <img
                    src="/static/images/logoamerican.jpeg"
                    alt="American FutureTech LLC"
                    className="h-full w-full object-contain"
                  />

                </div>
              </Link>

              {/* Heading */}
              <div className="mt-12">

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-300 backdrop-blur-sm">

                  <HiOutlineSparkles className="h-4 w-4 text-primary-300" />

                  Professional Learning Platform

                </div>

                <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.03em] text-white xl:text-5xl">

                  Build skills.
                  <span className="block text-primary-300">
                    Build your future.
                  </span>

                </h1>

                <p className="mt-6 max-w-lg text-base leading-7 text-slate-400">
                  Learn in-demand technology skills, complete
                  industry-focused courses, and prepare yourself
                  for the opportunities ahead.
                </p>

              </div>

              {/* Features */}
              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                    <HiOutlineAcademicCap className="h-5 w-5 text-primary-300" />
                  </div>

                  <p className="mt-3 text-sm font-bold text-white">
                    Learn
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    Industry-focused courses.
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                    <HiOutlineBookOpen className="h-5 w-5 text-primary-300" />
                  </div>

                  <p className="mt-3 text-sm font-bold text-white">
                    Practice
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    Build practical skills.
                  </p>

                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-sm">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">

                    <HiOutlineShieldCheck className="h-5 w-5 text-primary-300" />

                  </div>

                  <p className="mt-3 text-sm font-bold text-white">
                    Grow
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    Prepare for your career.
                  </p>

                </div>

              </div>

              {/* Bottom */}
              <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6">

                <div className="h-2 w-2 rounded-full bg-emerald-400" />

                <p className="text-xs font-medium text-slate-400">
                  Learn Today, Lead Tomorrow
                </p>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            RIGHT AUTH AREA
        ====================================================== */}
        <section className="flex min-h-screen items-center justify-center bg-white px-5 py-10 sm:px-8 lg:px-12">

          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="mb-8 flex justify-center lg:hidden">

              <Link
                to="/"
                className="flex h-14 w-[180px] items-center overflow-hidden rounded-xl bg-white"
              >
                <img
                  src="/static/images/logoamerican.jpeg"
                  alt="American FutureTech LLC"
                  className="h-full w-full object-contain"
                />
              </Link>

            </div>

            {/* Login / Register */}
            <Outlet />

            {/* Footer */}
            <p className="mt-8 text-center text-[11px] leading-5 text-slate-400">
              © {new Date().getFullYear()} American FutureTech LLC.
              All rights reserved.
            </p>

          </div>

        </section>

      </div>
    </div>
  );
};

export default AuthLayout;