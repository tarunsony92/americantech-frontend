import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import { loadStripe } from "@stripe/stripe-js";

import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  HiOutlineLockClosed,
  HiCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineTicket,
} from "react-icons/hi";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import paymentService from "../services/paymentService";
import useResourceItem from "../hooks/useResourceItem";
import ApplyCoupon from "../features/coupons/ApplyCoupon";
import { formatCurrencyINR } from "../utils/format";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// ---------------- Shared input styles ----------------
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

const labelClass =
  "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200";

// ---------------- Billing Form ----------------
const BillingForm = ({ billing, setBilling }) => {
  const handleChange = (e) => {
    setBilling((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-slate-900 sm:p-8">
      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
        Billing details
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Fields marked with * are required.
      </p>

      <div className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>First name *</label>
            <input
              name="firstName"
              value={billing.firstName}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Last name *</label>
            <input
              name="lastName"
              value={billing.lastName}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Company name (optional)</label>
          <input
            name="company"
            value={billing.company}
            onChange={handleChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Country / Region *</label>
          <select
            name="country"
            value={billing.country}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="US">United States (US)</option>
            <option value="IN">India</option>
          </select>
        </div>
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Street address 1 *</label>
          <input
            name="address1"
            placeholder="House number and street name"
            value={billing.address1}
            onChange={handleChange}
            required
            className={`mb-3 ${inputClass}`}
          />
          </div>
          <div>
            <label className={labelClass}>Street address 2 (optional)</label>
          <input
            name="address2"
            placeholder="Apartment, suite, unit, etc. (optional)"
            value={billing.address2}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        </div>

        <div>
          <label className={labelClass}>Town / City *</label>
          <input
            name="city"
            value={billing.city}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>State *</label>
            <input
              name="state"
              value={billing.state}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>ZIP Code *</label>
            <input
              name="zip"
              value={billing.zip}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Phone *</label>
            <input
              name="phone"
              type="tel"
              value={billing.phone}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email address *</label>
            <input
              name="email"
              type="email"
              value={billing.email}
              onChange={handleChange}
              required
              className={inputClass}
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-5 dark:border-slate-700">
          <h3 className="mb-2 text-base font-bold text-slate-900 dark:text-white">
            Additional information
          </h3>
          <label className={labelClass}>Order notes (optional)</label>
          <textarea
            name="notes"
            rows={3}
            placeholder="Notes about your order, e.g. special notes for delivery."
            value={billing.notes}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
};

// ---------------- Payment Method Selector ----------------
const PAYMENT_METHODS = [
  { id: "card", label: "Credit / Debit Card", enabled: true },
  { id: "alipay", label: "Alipay", enabled: true },
  { id: "klarna", label: "Klarna", enabled: true },
  { id: "afterpay", label: "Afterpay", enabled: true },
  { id: "affirm", label: "Affirm — Pay over time", enabled: true },
];

const PaymentMethodList = ({ selected, onSelect }) => (
  <div className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
    {PAYMENT_METHODS.map((method) => (
      <label
        key={method.id}
        className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
          method.enabled
            ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60"
            : "cursor-not-allowed opacity-50"
        } ${selected === method.id ? "bg-indigo-50 dark:bg-indigo-950/40" : ""}`}
      >
        <input
          type="radio"
          name="paymentMethod"
          disabled={!method.enabled}
          checked={selected === method.id}
          onChange={() => method.enabled && onSelect(method.id)}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
        />
        <span className="font-medium text-slate-700 dark:text-slate-200">
          {method.label}
        </span>
        {!method.enabled && (
          <span className="ml-auto rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 dark:bg-slate-800">
            Coming soon
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
      {errorMsg && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          {errorMsg}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 py-3 font-semibold text-white shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <HiOutlineLockClosed className="h-4 w-4" />
        {submitting ? "Processing..." : "Pay Now"}
      </button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <HiOutlineShieldCheck className="h-3.5 w-3.5" />
        Payments are encrypted and securely processed by Stripe.
      </p>
    </form>
  );
};

// ---------------- Order Summary ----------------
const OrderSummary = ({
  course,
  subtotal,
  discountAmount,
  appliedCoupon,
  setAppliedCoupon,
  finalAmount,
  selectedMethod,
  setSelectedMethod,
  clientSecret,
  initError,
  handlePaymentSuccess,
  billing,
}) => (
  <div className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 dark:bg-slate-900 sm:p-8 lg:sticky lg:top-6">
    <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
      Order summary
    </h2>

    <div className="mt-5 flex items-start justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-700">
      <div className="flex items-center gap-3">
        {course.image && (
          <img
            src={course.image}
            alt={course.title}
            className="h-14 w-14 flex-shrink-0 rounded-lg object-cover ring-1 ring-black/5"
          />
        )}
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            {course.title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Qty: 1</p>
        </div>
      </div>
      <span className="whitespace-nowrap text-sm font-semibold text-slate-800 dark:text-slate-100">
        {formatCurrencyINR(course.price)}
      </span>
    </div>

    <div className="flex justify-between border-b border-slate-200 py-3 text-sm dark:border-slate-700">
      <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
      <span className="font-medium text-slate-800 dark:text-slate-100">
        {formatCurrencyINR(subtotal)}
      </span>
    </div>

    {/* Coupon */}
    <div className="border-b border-slate-200 py-4 dark:border-slate-700">
      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
        <HiOutlineTicket className="h-4 w-4 text-indigo-500" />
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

    {appliedCoupon && (
      <div className="flex justify-between border-b border-slate-200 py-3 text-sm text-emerald-600 dark:border-slate-700">
        <span>Discount ({appliedCoupon.code})</span>
        <span className="font-semibold">
          − {formatCurrencyINR(discountAmount)}
        </span>
      </div>
    )}

    <div className="flex justify-between py-4 text-base font-bold text-slate-900 dark:text-white">
      <span>Total</span>
      <span>{formatCurrencyINR(finalAmount)}</span>
    </div>

    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        Payment method
      </p>
      <PaymentMethodList selected={selectedMethod} onSelect={setSelectedMethod} />
    </div>

    <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
      Your personal data will be used to process your order, support your
      experience throughout this website, and for other purposes described in
      our{" "}
      <a href="/privacy-policy" className="underline hover:text-indigo-600">
        privacy policy
      </a>
      .
    </p>

    {initError && (
      <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
        {initError}
      </p>
    )}

    {clientSecret && (
      <Elements
        stripe={stripePromise}
        options={{ clientSecret, appearance: { theme: "stripe" } }}
      >
        <StripeCardForm onSuccess={handlePaymentSuccess} billing={billing} />
      </Elements>
    )}

    {!clientSecret && !initError && (
      <div className="mt-4 flex items-center justify-center gap-2 py-4 text-sm text-slate-400">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-500" />
        Preparing payment form...
      </div>
    )}
  </div>
);

// ---------------- Main Checkout Page ----------------
const CheckoutPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
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
  const discountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount || 0) : 0;
  const finalAmount = Math.max(0, subtotal - discountAmount);

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
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-3 py-24 text-slate-500">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
        Loading checkout...
      </div>
    );
  }

  if (enrollDone) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40">
          <HiCheckCircle className="h-12 w-12 text-emerald-500" />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white">
          Payment Successful!
        </h1>
        <p className="mt-2 max-w-md text-slate-600 dark:text-slate-300">
          You're enrolled in <strong>{course.title}</strong>. Check your
          dashboard for course access.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-6 py-2.5 font-semibold text-white shadow-md transition-opacity hover:opacity-90"
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

      <div className="bg-slate-50 py-10 dark:bg-slate-950">
        <div className="container-page">
          <div className="mb-8 flex items-center gap-2 text-sm text-black-500 dark:text-slate-400">
            <HiOutlineLockClosed className="h-5 w-5" />
            Secure checkout
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
            <BillingForm billing={billing} setBilling={setBilling} />

            <OrderSummary
              course={course}
              subtotal={subtotal}
              discountAmount={discountAmount}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
              finalAmount={finalAmount}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
              clientSecret={clientSecret}
              initError={initError}
              handlePaymentSuccess={handlePaymentSuccess}
              billing={billing}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;