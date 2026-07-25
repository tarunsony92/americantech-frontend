import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import authService from "../../services/authService";
import { fetchProfile } from "../../redux/slices/authSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: { fullName: user?.fullName || "", phone: user?.phone || "" },
  });
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [errorMessage, setErrorMessage] = useState(null);

  const onSubmit = async (data) => {
    setStatus("idle");
    setErrorMessage(null);
    try {
      // Email is intentionally not editable here — it's the account identifier and changing it
      // needs its own verification flow, not a plain profile-form field.
      await authService.updateProfile({ fullName: data.fullName, phone: data.phone });
      await dispatch(fetchProfile());
      setStatus("success");
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "Couldn't save your changes. Please try again.");
      setStatus("error");
    }
  };

  return (
    <>
      <Helmet><title>Profile | American FutureTech</title></Helmet>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 max-w-lg space-y-5 p-6">
        <div>
          <label className="mb-1.5 block text-sm font-medium">Full Name</label>
          <input {...register("fullName", { required: true })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Phone</label>
          <input {...register("phone")} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 dark:border-slate-700 dark:bg-slate-900" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input type="email" value={user?.email || ""} disabled className="w-full rounded-lg border border-slate-200 bg-slate-100 px-4 py-2.5 text-slate-500 dark:border-slate-800 dark:bg-slate-800" />
        </div>
        {status === "success" && <p className="text-sm text-green-600">Profile updated successfully.</p>}
        {status === "error" && <p className="text-sm text-red-500">{errorMessage}</p>}
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </>
  );
};

export default Profile;
