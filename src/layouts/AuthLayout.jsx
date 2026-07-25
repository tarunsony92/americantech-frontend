import { Outlet, Link } from "react-router-dom";

const AuthLayout = () => (
  <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
    <div className="relative hidden items-center justify-center bg-gradient-to-br from-primary-800 to-primary-600 p-12 text-white lg:flex">
      <div className="max-w-md">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <span className="flex h-15 w-30 items-center border justify-center rounded-lg  text-white"><img src="../../static/images/logo.png" alt="Logo" className="h-full w-full object-contain" /></span>
          American FutureTech
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
