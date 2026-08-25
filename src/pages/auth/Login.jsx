import { useForm } from "react-hook-form";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";

import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
} from "react-icons/hi";

import {
  loginUser,
  clearAuthError,
} from "../../redux/slices/authSlice";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { status, error } = useSelector(
    (state) => state.auth
  );

  const onSubmit = async (data) => {
    dispatch(clearAuthError());

    const result = await dispatch(
      loginUser(data)
    );

    if (loginUser.fulfilled.match(result)) {
      navigate(
        location.state?.from?.pathname ||
          "/dashboard",
        {
          replace: true,
        }
      );
    }
  };

  return (
    <>
      <Helmet>
        <title>
          Login | American FutureTech
        </title>
      </Helmet>

      {/* =====================================================
          LOGIN CARD
      ====================================================== */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.3)] sm:p-8">

        {/* Header */}
        <div>

          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#141E32] text-primary-300 shadow-lg shadow-slate-900/10">

            <HiOutlineShieldCheck className="h-6 w-6" />

          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#141E32]">
            Log in to your account
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Log in to access your dashboard and
            continue learning.
          </p>

        </div>

        {/* =================================================
            FORM
        ================================================== */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-7 space-y-5"
        >

          {/* Email */}
          <div>

            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email address
            </label>

            <div className="relative">

              <HiOutlineMail
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
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                {...register("email", {
                  required:
                    "Email is required",
                })}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-11
                  pr-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-primary-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-primary-500/10
                "
              />

            </div>

            {errors.email && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.email.message}
              </p>
            )}

          </div>

          {/* Password */}
          <div>

            <div className="mb-2 flex items-center justify-between">

              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-primary-600 transition hover:text-primary-700 hover:underline"
              >
                Forgot password?
              </Link>

            </div>

            <div className="relative">

              <HiOutlineLockClosed
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
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                {...register("password", {
                  required:
                    "Password is required",
                })}
                className="
                  h-12
                  w-full
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  pl-11
                  pr-4
                  text-sm
                  text-slate-800
                  outline-none
                  transition
                  placeholder:text-slate-400
                  focus:border-primary-500
                  focus:bg-white
                  focus:ring-4
                  focus:ring-primary-500/10
                "
              />

            </div>

            {errors.password && (
              <p className="mt-1.5 text-xs font-medium text-red-500">
                {errors.password.message}
              </p>
            )}

          </div>

          {/* API Error */}
          {error && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={status === "loading"}
            className="
              group
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#141E32]
              px-5
              text-sm
              font-bold
              text-white
              shadow-lg
              shadow-slate-900/15
              transition
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#1A2740]
              hover:shadow-xl
              disabled:cursor-not-allowed
              disabled:opacity-60
              disabled:hover:translate-y-0
            "
          >

            {status === "loading" ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                Logging in...
              </>
            ) : (
              <>
                Log In

                <HiOutlineArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </>
            )}

          </button>

        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">

          <div className="h-px flex-1 bg-slate-100" />

          {/* <span className="text-[11px] font-medium text-slate-400">
            New to American FutureTech?
          </span> */}

          <div className="h-px flex-1 bg-slate-100" />

        </div>

        {/* Register */}
        {/* <Link
          to="/register"
          className="
            flex
            h-11
            w-full
            items-center
            justify-center
            rounded-xl
            border
            border-slate-200
            bg-white
            text-sm
            font-bold
            text-slate-700
            transition
            hover:border-primary-200
            hover:bg-primary-50/50
            hover:text-primary-600
          "
        >
          Create an account
        </Link> */}

      </div>

      {/* Small security text */}
      <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-400">

        <HiOutlineShieldCheck className="h-4 w-4 text-emerald-500" />

        Secure student authentication

      </div>
    </>
  );
};

export default Login;