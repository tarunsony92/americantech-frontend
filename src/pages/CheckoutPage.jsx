import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { loadStripe } from "@stripe/stripe-js";

import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { HiOutlineLockClosed, HiCheckCircle } from "react-icons/hi";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import paymentService from "../services/paymentService";
import useResourceItem from "../hooks/useResourceItem";
import ApplyCoupon from "../features/coupons/ApplyCoupon";
import { formatCurrencyINR } from "../utils/format";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const US_STATES = [
  "California", "New York", "Texas", "Florida", "Illinois",
];

// ---------------- Billing Form ----------------
const BillingForm = ({ billing, setBilling }) => {
  const handleChange = (e) => {
    setBilling((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            First name *
          </label>
          <input
            name="firstName"
            value={billing.firstName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Last name *
          </label>
          <input
            name="lastName"
            value={billing.lastName}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Company name (optional)
        </label>
        <input
          name="company"
          value={billing.company}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Country / Region *
        </label>
        <select
          name="country"
          value={billing.country}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        >
          <option value="US">United States (US)</option>
          <option value="IN">India</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Street address *
        </label>
        <input
          name="address1"
          placeholder="House number and street name"
          value={billing.address1}
          onChange={handleChange}
          required
          className="mb-3 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        />
        <input
          name="address2"
          placeholder="Apartment, suite, unit, etc. (optional)"
          value={billing.address2}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Town / City *
        </label>
        <input
          name="city"
          value={billing.city}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            State *
          </label>
          <select
            name="state"
            value={billing.state}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
          >
            <option value="">Select state</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
            ZIP Code *
          </label>
          <input
            name="zip"
            value={billing.zip}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Phone *
        </label>
        <input
          name="phone"
          type="tel"
          value={billing.phone}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Email address *
        </label>
        <input
          name="email"
          type="email"
          value={billing.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        />
      </div>

      <div>
        <h3 className="mb-2 border-t border-slate-200 pt-5 text-base font-bold text-slate-900 dark:border-slate-700 dark:text-white">
          Additional information
        </h3>
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-200">
          Order notes (optional)
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Notes about your order, e.g. special notes for delivery."
          value={billing.notes}
          onChange={handleChange}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
        />
      </div>
    </div>
  );
};

// ---------------- Payment Method Selector ----------------
const PAYMENT_METHODS = [
  { id: "card", label: "Credit/Debit Cards", enabled: true },
  { id: "alipay", label: "Alipay", enabled: false },
  { id: "klarna", label: "Klarna", enabled: false },
  { id: "afterpay", label: "Afterpay", enabled: false },
  { id: "affirm", label: "Affirm — Pay over time", enabled: false },
];

const PaymentMethodList = ({ selected, onSelect }) => (
  <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
    {PAYMENT_METHODS.map((method) => (
      <label
        key={method.id}
        className={`flex cursor-pointer items-center gap-3 px-4 py-3 text-sm ${
          !method.enabled ? "cursor-not-allowed opacity-50" : ""
        } ${selected === method.id ? "bg-indigo-50 dark:bg-indigo-950/40" : ""}`}
      >
        <input
          type="radio"
          name="paymentMethod"
          disabled={!method.enabled}
          checked={selected === method.id}
          onChange={() => method.enabled && onSelect(method.id)}
          className="h-4 w-4 text-indigo-600"
        />
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {method.label}
        </span>
        {!method.enabled && (
          <span className="ml-auto text-[10px] uppercase tracking-wide text-slate-400">
            coming soon
          </span>
        )}
      </label>
    ))}
  </div>
);

// ---------------- Stripe Card Form (inner, needs Elements context) ----------------
const StripeCardForm = ({ onSuccess, billing }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setErrorMsg(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
        payment_method_data: {
          billing_details: {
            name: `${billing.firstName} ${billing.lastName}`.trim(),
            email: billing.email,
            phone: billing.phone,
            address: {
              line1: billing.address1,
              line2: billing.address2,
              city: billing.city,
              state: billing.state,
              postal_code: billing.zip,
              country: billing.country,
            },
          },
        },
      },
      redirect: "if_required",
    });

    if (error) {
      setErrorMsg(error.message || "Payment failed. Please try again.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
    } else {
      setErrorMsg("Payment could not be confirmed. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="mt-4 space-y-4">
      <PaymentElement />
      {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 py-3 font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        <HiOutlineLockClosed className="h-4 w-4" />
        {submitting ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

// ---------------- Main Checkout Page ----------------
const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { item: course, loading } = useResourceItem(courseService, id);

  const [billing, setBilling] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    company: "",
    country: "US",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: user?.email || "",
    notes: "",
  });

  const [selectedMethod, setSelectedMethod] = useState("card");
  const [clientSecret, setClientSecret] = useState(null);
  const [initError, setInitError] = useState(null);
  const [enrollDone, setEnrollDone] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);



  const subtotal = Number(course?.price || 0);

const discountAmount = appliedCoupon
  ? Number(appliedCoupon.discountAmount || 0)
  : 0;

const finalAmount = Math.max(
  0,
  subtotal - discountAmount
);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/register", { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  // Create the PaymentIntent as soon as course is loaded
  useEffect(() => {
    if (!course) return;

    const courseId = course._id || course.id;

    if (!courseId) {
      console.error("No course id found on course object:", course);
      setInitError("Could not initialize payment (missing course id).");
      return;
    }

    const initPayment = async () => {
      try {
        const res = await paymentService.createPaymentIntent({
          courseId,
          amount: Math.round(course.price * 100), // paise/cents
        });

        if (!res?.data?.clientSecret) {
          console.error("No clientSecret in response:", res?.data);
          setInitError("Could not initialize payment (no clientSecret returned).");
          return;
        }

        setClientSecret(res.data.clientSecret);
      } catch (err) {
        console.error("Payment init error (full):", err);
        console.error("Payment init error - response data:", err.response?.data);
        console.error("Payment init error - status:", err.response?.status);
        console.error("Payment init error - request URL:", err.config?.baseURL, err.config?.url);

        setInitError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          `Could not initialize payment${err.response?.status ? ` (status ${err.response.status})` : ""}.`
        );
      }
    };

    initPayment();
  }, [course]);

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      await enrollmentService.enrollSelf(id, {
        paymentIntentId: paymentIntent.id,
      });
    } catch (err) {
      console.error("Enrollment failed after payment:", err);
    }
    setEnrollDone(true);
  };

  if (loading || !course) {
    return (
      <div className="container-page py-24 text-center text-slate-500">
        Loading checkout...
      </div>
    );
  }

  if (enrollDone) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <HiCheckCircle className="h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
          Payment Successful!
        </h1>
        <p className="mt-2 max-w-md text-slate-600 dark:text-slate-300">
          You're enrolled in <strong>{course.title}</strong>. Check your
          dashboard for course access.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-6 py-2.5 font-semibold text-white shadow-md"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout — {course.title} | American FutureTech</title>
      </Helmet>

      <div className="bg-rose-50/60 py-10 dark:bg-slate-950">
        <div className="container-page grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
          {/* LEFT: Billing form */}
          <div>
            <h1 className="mb-6 text-xl font-extrabold text-slate-900 dark:text-white">
              Billing details
            </h1>
            <BillingForm billing={billing} setBilling={setBilling} />
          </div>

          {/* RIGHT: Order summary + payment */}
          <div className="h-fit rounded-2xl bg-white p-6 shadow-md ring-1 ring-black/5 dark:bg-slate-900">
            <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
              <div className="flex justify-between text-sm font-semibold text-slate-500">
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-200">
                  {course.title} × 1
                </span>
                <span className="font-medium">
                  {formatCurrencyINR(course.price)}
                </span>
              </div>
            </div>

           <div className="flex justify-between border-b border-slate-200 py-3 text-sm dark:border-slate-700">
  <span className="text-slate-500">Subtotal</span>
  <span className="font-medium">
    {formatCurrencyINR(subtotal)}
  </span>
</div>

{/* Coupon */}
<div className="border-b border-slate-200 py-4 dark:border-slate-700">
  <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
    Have a coupon?
  </p>

  <ApplyCoupon
    courseId={course._id || course.id}
    orderAmount={subtotal}
    appliedCoupon={appliedCoupon}
    onApply={setAppliedCoupon}
    onRemove={() => setAppliedCoupon(null)}
  />
</div>

{/* Discount */}
{appliedCoupon && (
  <div className="flex justify-between py-3 text-sm text-emerald-600">
    <span>
      Discount ({appliedCoupon.code})
    </span>

    <span className="font-semibold">
      - {formatCurrencyINR(discountAmount)}
    </span>
  </div>
)}

{/* Final Total */}
<div className="flex justify-between py-3 text-base font-bold text-slate-900 dark:text-white">
  <span>Total</span>

  <span>
    {formatCurrencyINR(finalAmount)}
  </span>
</div>

            <div className="mt-4">
              <PaymentMethodList
                selected={selectedMethod}
                onSelect={setSelectedMethod}
              />
            </div>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Your personal data will be used to process your order, support
              your experience throughout this website, and for other purposes
              described in our{" "}
              <a href="/privacy-policy" className="underline">
                privacy policy
              </a>
              .
            </p>

            {initError && (
              <p className="mt-3 text-sm text-red-500">{initError}</p>
            )}

            {selectedMethod === "card" && clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: { theme: "stripe" } }}
              >
                <StripeCardForm
                  onSuccess={handlePaymentSuccess}
                  billing={billing}
                />
              </Elements>
            )}

            {selectedMethod === "card" && !clientSecret && !initError && (
              <p className="mt-4 text-center text-sm text-slate-400">
                Preparing payment form...
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;