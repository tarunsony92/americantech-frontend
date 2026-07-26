import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => (
  <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
    <div className="relative hidden items-center justify-center bg-gradient-to-br from-primary-800 to-primary-600 p-12 text-white lg:flex">
      <div className="max-w-md">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <span className="group flex h-full w-full items-center justify-center rounded-2xl bg-white p-2 shadow-lg ring-1 ring-slate-200 transition-all duration-300 hover:scale-105 hover:shadow-xl dark:bg-slate-800 dark:ring-slate-700">
  <img
    src="/static/images/logo.png"
    alt="American FutureTech Logo"
    className="h-full w-full object-contain transition-transform duration-300 "
  />
</span>
        </Link>
        <h2 className="mt-8 text-3xl font-bold leading-snug">
          Join thousands building careers in technology.
        </h2>
        <p className="mt-4 text-primary-100">
          Access your courses, track your progress and connect with hiring partners — all in one place.
        </p>
      </div>
    </div>
    <div className="flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
