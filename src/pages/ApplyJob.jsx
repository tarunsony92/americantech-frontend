import { useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import { jobApplicationService } from "../services/jobService";
import jobService from "../services/jobService";
import useResourceItem from "../hooks/useResourceItem";

const ApplyJob = () => {
  const { id } = useParams();
  const { item: job } = useResourceItem(jobService, id);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [status, setStatus] = useState("idle");

  const onSubmit = async (data) => {
    setStatus("loading");
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "resume") formData.append("resume", value[0]);
        else formData.append(key, value);
      });
      formData.append("jobId", job?.id);
      await jobApplicationService.create(formData);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <Helmet><title>Apply — {job?.title || "Job"} | American FutureTech</title></Helmet>
      <PageHeader
        title={`Apply for ${job?.title || "this role"}`}
        subtitle={job?.company?.name}
        breadcrumbItems={[{ label: "Careers", to: "/careers" }, { label: job?.title || "Job", to: `/careers/${id}` }, { label: "Apply" }]}
      />

      <section className="container-page max-w-2xl py-16">
        {status === "success" ? (
          <div className="card p-8 text-center">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Application submitted!</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">We'll be in touch if your profile is a match.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Full Name</label>
              <input {...register("fullName", { required: "Name is required" })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
              {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <input type="email" {...register("email", { required: "Email is required" })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Phone</label>
              <input {...register("phone", { required: "Phone is required" })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Resume (PDF)</label>
              <input type="file" accept=".pdf" {...register("resume", { required: "Resume is required" })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-900" />
              {errors.resume && <p className="mt-1 text-xs text-red-500">{errors.resume.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Cover Letter</label>
              <textarea rows={4} {...register("coverLetter")} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
            </div>
            {status === "error" && <p className="text-sm text-red-500">Something went wrong. Please try again.</p>}
            <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
              {status === "loading" ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}
      </section>
    </>
  );
};

export default ApplyJob;
