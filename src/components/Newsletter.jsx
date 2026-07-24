import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactService } from "../services/contactService";

const Newsletter = ({ compact = false }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [status, setStatus] = useState("idle");

  const onSubmit = async (data) => {
    setStatus("loading");
    try {
      await contactService.subscribeNewsletter(data);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={compact ? "" : "mx-auto max-w-md"}>
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Your email address"
          {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800"
        />
        <button type="submit" className="btn-primary shrink-0" disabled={status === "loading"}>
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </div>
      {errors.email && <p className="mt-1 text-xs text-red-500">A valid email is required.</p>}
      {status === "success" && <p className="mt-1 text-xs text-green-600">Subscribed successfully!</p>}
      {status === "error" && <p className="mt-1 text-xs text-red-500">Something went wrong, try again.</p>}
    </form>
  );
};

export default Newsletter;
