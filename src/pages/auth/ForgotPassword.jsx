import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import authService from "../../services/authService";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [status, setStatus] = useState("idle");

  const onSubmit = async (data) => {
    setStatus("loading");
    try {
      await authService.forgotPassword(data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password | American Tech Global</title></Helmet>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Reset your password</h1>
      <p className="mt-1 text-sm text-slate-500">Enter your email and we'll send you a reset link.</p>

      {status === "success" ? (
        <p className="mt-8 rounded-lg bg-primary-50 p-4 text-sm text-primary-700 dark:bg-primary-950 dark:text-primary-300">
          If an account exists for that email, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input type="email" {...register("email", { required: "Email is required" })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          {status === "error" && <p className="text-sm text-red-500">Something went wrong. Please try again.</p>}
          <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
            {status === "loading" ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-slate-500">
        <Link to="/login" className="font-medium text-primary-600 hover:underline">Back to login</Link>
      </p>
    </>
  );
};

export default ForgotPassword;
