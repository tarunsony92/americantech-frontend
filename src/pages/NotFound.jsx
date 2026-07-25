import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFound = () => (
  <>
    <Helmet><title>Page Not Found | American FutureTech</title></Helmet>
    <div className="container-page flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="text-7xl font-extrabold text-primary-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-2 max-w-md text-slate-500">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  </>
);

export default NotFound;
