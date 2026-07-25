import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { loginUser, clearAuthError, logout } from "../../redux/slices/authSlice";

// Dedicated admin portal login — intentionally a separate page/route from the user-facing
// /login so admin and user auth are never presented on the same page. Uses the same backend
// /auth/login endpoint (there's one account store and one set of credentials), but rejects
// the session client-side if the authenticated account isn't an admin.
const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);

  const onSubmit = async (data) => {
    dispatch(clearAuthError());
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      if (result.payload?.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        dispatch(logout());
      }
    }
  };

  return (
    <>
      <Helmet><title>Admin Login | American FutureTech</title></Helmet>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Portal</h1>
      <p className="mt-1 text-sm text-slate-500">Restricted access. Administrator credentials only.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input type="email" {...register("email", { required: "Email is required" })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Password</label>
          <input type="password" {...register("password", { required: "Password is required" })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
          {status === "loading" ? "Logging in..." : "Log In"}
        </button>
      </form>
    </>
  );
};

export default AdminLogin;
