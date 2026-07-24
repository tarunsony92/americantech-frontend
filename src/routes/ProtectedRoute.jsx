import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ allowedRoles, redirectTo = "/login", deniedRedirectTo }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Logged in, but the wrong portal for their role — send them to the portal's own
    // login rather than the other portal's dashboard, so a student can never land on
    // an admin page (and vice versa) even transiently.
    return <Navigate to={deniedRedirectTo || redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
