import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import { addCoupon, editCoupon } from "./couponSlice";

const defaultValues = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  scope: "all",
  applicableCourseIds: "",
  maxDiscountAmount: "",
  minOrderAmount: "0",
  usageLimit: "",
  perUserLimit: "1",
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

export default function CouponFormModal({ coupon, onClose }) {
  const dispatch = useDispatch();
  const isEdit = Boolean(coupon);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: coupon
      ? {
          ...defaultValues,
          ...coupon,
          startsAt: coupon.startsAt ? coupon.startsAt.slice(0, 16) : "",
          expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 16) : "",
        }
      : defaultValues,
  });

  useEffect(() => {
    if (coupon) {
      reset({
        ...defaultValues,
        ...coupon,
        startsAt: coupon.startsAt ? coupon.startsAt.slice(0, 16) : "",
        expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 16) : "",
      });
    }
  }, [coupon, reset]);

  const discountType = watch("discountType");
  const scope = watch("scope");

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      discountValue: Number(values.discountValue),
      maxDiscountAmount: values.maxDiscountAmount ? Number(values.maxDiscountAmount) : null,
      minOrderAmount: values.minOrderAmount ? Number(values.minOrderAmount) : 0,
      usageLimit: values.usageLimit ? Number(values.usageLimit) : null,
      perUserLimit: values.perUserLimit ? Number(values.perUserLimit) : 1,
      startsAt: values.startsAt || null,
      expiresAt: values.expiresAt || null,
      applicableCourseIds: values.scope === "specific" ? values.applicableCourseIds : null,
    };

    if (isEdit) {
      await dispatch(editCoupon({ id: coupon.id, payload }));
    } else {
      await dispatch(addCoupon(payload));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? "Edit Coupon" : "Create Coupon"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Coupon Code</label>
            <input
              {...register("code", { required: "Code is required" })}
              placeholder="WELCOME10"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm uppercase focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Discount Type</label>
              <select
                {...register("discountType", { required: true })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Discount Value {discountType === "percentage" ? "(%)" : "($)"}
              </label>
              <input
                type="number"
                step="0.01"
                {...register("discountValue", { required: "Required", min: 0 })}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              {errors.discountValue && (
                <p className="mt-1 text-xs text-red-500">{errors.discountValue.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Scope</label>
            <select
              {...register("scope")}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="all">All Courses</option>
              <option value="specific">Specific Courses</option>
            </select>
          </div>

          {scope === "specific" && (
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Applicable Course IDs (comma separated)
              </label>
              <input
                {...register("applicableCourseIds")}
                placeholder="1,4,7"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Max Discount ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("maxDiscountAmount")}
                placeholder="Optional cap"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Min Order Amount ($)</label>
              <input
                type="number"
                step="0.01"
                {...register("minOrderAmount")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Total Usage Limit</label>
              <input
                type="number"
                {...register("usageLimit")}
                placeholder="Unlimited if empty"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Per User Limit</label>
              <input
                type="number"
                {...register("perUserLimit")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Starts At</label>
              <input
                type="datetime-local"
                {...register("startsAt")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Expires At</label>
              <input
                type="datetime-local"
                {...register("expiresAt")}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" {...register("isActive")} className="h-4 w-4 rounded border-gray-300" />
            Active
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-tl-xl rounded-br-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-tl-xl rounded-br-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Update Coupon" : "Create Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}