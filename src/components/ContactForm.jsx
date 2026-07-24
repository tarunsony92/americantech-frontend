import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactService } from "../services/contactService";

const ContactForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [status, setStatus] = useState("idle");

  const onSubmit = async (data) => {
    setStatus("loading");
    try {
      await contactService.submit(data);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input
            placeholder="Full Name"
            {...register("name", { required: true })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">Name is required.</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">Valid email is required.</p>}
        </div>
      </div>
      <input
        placeholder="Phone Number"
        {...register("phone")}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800"
      />
      <input
        placeholder="Subject"
        {...register("subject", { required: true })}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800"
      />
      <textarea
        rows={5}
        placeholder="Your Message"
        {...register("message", { required: true })}
        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-800"
      />
      <button type="submit" className="btn-primary w-full sm:w-auto" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send Message"}
      </button>
      {status === "success" && <p className="text-sm text-green-600">Message sent! We'll get back to you shortly.</p>}
      {status === "error" && <p className="text-sm text-red-500">Failed to send. Please try again.</p>}
    </form>
  );
};

export default ContactForm;
