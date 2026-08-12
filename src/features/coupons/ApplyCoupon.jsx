import { useState } from "react";
import { Tag, X, CheckCircle2, Loader2 } from "lucide-react";
import { validateCoupon } from "./couponService";

// Usage in your checkout page:
//
//   const [appliedCoupon, setAppliedCoupon] = useState(null);
//   const finalAmount = appliedCoupon ? appliedCoupon.finalAmount : course.price;
//
//   <ApplyCoupon
//     courseId={course.id}
//     orderAmount={course.price}
//     appliedCoupon={appliedCoupon}
//     onApply={setAppliedCoupon}
//     onRemove={() => setAppliedCoupon(null)}
//   />
//
// Pass `finalAmount` (in paise/cents as your Stripe setup expects) to your
// Stripe PaymentIntent creation call instead of the raw course price.

export default function ApplyCoupon({ courseId, orderAmount, appliedCoupon, onApply, onRemove }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");
    try {
      const result = await validateCoupon({ code: code.trim(), courseId, orderAmount });
      onApply(result);
      setCode("");
    } catch (err) {
      setError(err?.response?.data?.message || "Could not apply coupon");
    } finally {
      setLoading(false);
    }
  };

  if (appliedCoupon) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <CheckCircle2 size={18} />
          <span>
            <span className="font-semibold">{appliedCoupon.code}</span> applied — you saved $
            {appliedCoupon.discountAmount}
          </span>
        </div>
        <button onClick={onRemove} className="text-green-700 hover:text-green-900">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Enter coupon code"
            className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm uppercase focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !code.trim()}
          className="flex items-center gap-1 rounded-tl-xl rounded-br-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Apply"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}