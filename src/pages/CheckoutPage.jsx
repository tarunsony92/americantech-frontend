import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  HiOutlineShieldCheck,
  HiOutlineTicket,
} from "react-icons/hi";
import courseService from "../services/courseService";
import enrollmentService from "../services/enrollmentService";
import paymentService from "../services/paymentService";
import checkoutOrderService from "../services/CheckoutOrderService";
import useResourceItem from "../hooks/useResourceItem";
import ApplyCoupon from "../features/coupons/ApplyCoupon";
import { formatCurrencyUSD } from "../utils/format";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Key used to hand off the payment result to the confirmation page.
// sessionStorage is used (not router state) because Stripe redirect-based
// methods (Klarna / Afterpay / Affirm / 3DS) do a full page reload on
// return, which would wipe any in-memory/router state.
const PAYMENT_RESULT_KEY = "checkout:lastPaymentResult";

// ---------------- Shared input styles ----------------
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

const labelClass =
  "mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200";

const errorInputClass =
  "border-red-400 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500";

// Fields that must be filled before "Pay Now" is allowed to proceed.
// (company, address2, notes are intentionally excluded — optional.)
const REQUIRED_BILLING_FIELDS = [
  "firstName",
  "lastName",
  "address1",
  "city",
  "state",
  "zip",
  "phone",
  "email",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Returns a { fieldName: "error message" } map for anything missing/invalid.
// Empty object means the billing form is good to go.
const getBillingErrors = (billing) => {
  const errors = {};
  REQUIRED_BILLING_FIELDS.forEach((field) => {
    if (!String(billing[field] || "").trim()) {
      errors[field] = "This field is required.";
    }
  });
  if (!errors.email && !EMAIL_RE.test(billing.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  return errors;
};

// ---------------- Billing Form ----------------
const BillingForm = ({ billing, setBilling, errors, fieldRefs, onFieldEdited }) => {
  const handleChange = (e) => {
    setBilling((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    onFieldEdited?.(e.target.name);
  };

  const fieldClass = (name) =>
    `${inputClass} ${errors[name] ? errorInputClass : ""}`;

  const FieldError = ({ name }) =>
    errors[name] ? (
      <p className="mt-1 text-xs font-medium text-red-500">{errors[name]}</p>
    ) : null;

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
              ref={(el) => (fieldRefs.current.firstName = el)}
              name="firstName"
              value={billing.firstName}
              onChange={handleChange}
              required
              className={fieldClass("firstName")}
            />
            <FieldError name="firstName" />
          </div>
          <div>
            <label className={labelClass}>Last name *</label>
            <input
              ref={(el) => (fieldRefs.current.lastName = el)}
              name="lastName"
              value={billing.lastName}
              onChange={handleChange}
              required
              className={fieldClass("lastName")}
            />
            <FieldError name="lastName" />
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
            disabled
            className={`${inputClass} cursor-not-allowed opacity-70`}
          >
            <option value="US">United States (US)</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>Street address *</label>
          <input
            ref={(el) => (fieldRefs.current.address1 = el)}
            name="address1"
            placeholder="House number and street name"
            value={billing.address1}
            onChange={handleChange}
            required
            className={`mb-1 ${fieldClass("address1")}`}
          />
          <FieldError name="address1" />
          <input
            name="address2"
            placeholder="Apartment, suite, unit, etc. (optional)"
            value={billing.address2}
            onChange={handleChange}
            className={`mt-2 ${inputClass}`}
          />
        </div>

        <div>
          <label className={labelClass}>Town / City *</label>
          <input
            ref={(el) => (fieldRefs.current.city = el)}
            name="city"
            value={billing.city}
            onChange={handleChange}
            required
            className={fieldClass("city")}
          />
          <FieldError name="city" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>State *</label>
            <input
              ref={(el) => (fieldRefs.current.state = el)}
              name="state"
              value={billing.state}
              onChange={handleChange}
              required
              className={fieldClass("state")}
            />
            <FieldError name="state" />
          </div>
          <div>
            <label className={labelClass}>ZIP Code *</label>
            <input
              ref={(el) => (fieldRefs.current.zip = el)}
              name="zip"
              value={billing.zip}
              onChange={handleChange}
              required
              className={fieldClass("zip")}
            />
            <FieldError name="zip" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Phone *</label>
            <input
              ref={(el) => (fieldRefs.current.phone = el)}
              name="phone"
              type="tel"
              value={billing.phone}
              onChange={handleChange}
              required
              className={fieldClass("phone")}
            />
            <FieldError name="phone" />
          </div>
          <div>
            <label className={labelClass}>Email address *</label>
            <input
              ref={(el) => (fieldRefs.current.email = el)}
              name="email"
              type="email"
              value={billing.email}
              onChange={handleChange}
              required
              className={fieldClass("email")}
            />
            <FieldError name="email" />
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

// ---------------- Stripe Card Form (inner, needs Elements context) ----------------
const StripeCardForm = ({
  onSuccess,
  onFailure,
  billing,
  courseId,
  onValidateBilling,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    // Gate: don't even touch Stripe until required billing fields are filled.
    // onValidateBilling scrolls/focuses the first bad field and returns false
    // if anything is missing/invalid.
    if (!onValidateBilling()) {
      setErrorMsg("Please fill in all required billing details before paying.");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/courses/${courseId}/checkout`,
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
      // Record the failed attempt in the backend regardless of whether the
      // user ever completes payment.
      await onFailure({
        paymentIntentId: error.payment_intent?.id,
        status: "failed",
        failureReason: error.message,
      });

      // Klarna/Afterpay/etc. reject unsupported regions with messages that
      // typically mention the method name, "not available", or the country --
      // give the customer a clear next step instead of a confusing raw error.
      const raw = (error.message || "").toLowerCase();
      const looksLikeRegionBlock =
        raw.includes("not available") ||
        raw.includes("not supported") ||
        raw.includes("unavailable in your region") ||
        raw.includes("country");

      setErrorMsg(
        looksLikeRegionBlock
          ? "This payment method isn't available in your region. Please pay with a card instead."
          : error.message || "Payment failed. Please try again."
      );
      setSubmitting(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
    } else {
      // Payment landed in an inconclusive state (e.g. requires_action loop,
      // or the user backed out of a redirect flow without an explicit error).
      await onFailure({
        paymentIntentId: paymentIntent?.id,
        status: "cancelled",
        failureReason: `Unresolved status: ${paymentIntent?.status || "unknown"}`,
      });
      setErrorMsg("Payment could not be confirmed. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="mt-4 space-y-4">
      <PaymentElement
        options={{
          // Force these to always render in the UI, regardless of the
          // customer's detected country/IP. NOTE: this does not make
          // Klarna/Afterpay functional outside their supported countries --
          // that restriction is enforced by Klarna/Afterpay themselves at
          // payment-confirmation time, not by this UI setting.
          paymentMethodOrder: ["card", "klarna", "afterpay_clearpay", "link"],
              defaultValues: {
      billingDetails: {
        email: billing.email,
      },
    },

          fields: {
            billingDetails: {
              address: "never",
              name: "never",
              email: "never",
              phone: "never",
            },
          },
        }}
      />
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
  clientSecret,
  paymentPreparing,
  initError,
  handlePaymentSuccess,
  handlePaymentFailure,
  billing,
  courseId,
  onValidateBilling,
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
        {formatCurrencyUSD(course.price)}
      </span>
    </div>

    <div className="flex justify-between border-b border-slate-200 py-3 text-sm dark:border-slate-700">
      <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
      <span className="font-medium text-slate-800 dark:text-slate-100">
        {formatCurrencyUSD(subtotal)}
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
          − {formatCurrencyUSD(discountAmount)}
        </span>
      </div>
    )}

    <div className="flex justify-between py-4 text-base font-bold text-slate-900 dark:text-white">
      <span>Total</span>
      <span>{formatCurrencyUSD(finalAmount)}</span>
    </div>

    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        Payment method
      </p>
      <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
        Choose your preferred option below — it will appear inside the secure payment form.
      </p>
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

    {/* Only render the Stripe form once we have a clientSecret that matches the
        CURRENT final amount. While a coupon is being applied/removed and a new
        PaymentIntent is being created (paymentPreparing === true), we hide the old
        form so the user can never submit a payment against a stale (pre-discount)
        clientSecret. */}
    {clientSecret && !paymentPreparing && (
      <Elements
        key={clientSecret}
        stripe={stripePromise}
        options={{ clientSecret, appearance: { theme: "stripe" } }}
      >
        <StripeCardForm
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          billing={billing}
          courseId={courseId}
          onValidateBilling={onValidateBilling}
        />
      </Elements>
    )}

    {(!clientSecret || paymentPreparing) && !initError && (
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
  const { item: course, loading } = useResourceItem(courseService, id);

  const [billing, setBilling] = useState({
    firstName: "",
    lastName: "",
    company: "",
    country: "US",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    notes: "",
  });

  const [clientSecret, setClientSecret] = useState(null);
  const [paymentPreparing, setPaymentPreparing] = useState(false);
  const [initError, setInitError] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [checkingRedirectStatus, setCheckingRedirectStatus] = useState(true);
  const [billingErrors, setBillingErrors] = useState({});
  // Holds refs to each required billing <input> so we can scroll to / focus
  // the first invalid one when "Pay Now" is blocked.
  const billingFieldRefs = useRef({});

  // Runs the required-field check, updates the error state (so red borders +
  // messages show under the offending fields), and scrolls/focuses the first
  // bad field. Returns true only when billing is fully valid.
  const validateBilling = () => {
    const errors = getBillingErrors(billing);
    setBillingErrors(errors);

    const firstBadField = REQUIRED_BILLING_FIELDS.find((f) => errors[f]);
    if (firstBadField) {
      const el = billingFieldRefs.current[firstBadField];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
      return false;
    }
    return true;
  };

  // Clears a single field's error as soon as the user edits it, instead of
  // making them wait for the next Pay Now attempt to see it go away.
  const clearFieldError = (fieldName) => {
    setBillingErrors((prev) => {
      if (!prev[fieldName]) return prev;
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  // Builds the shared order payload from current course/billing/coupon state
  // and posts it to the backend. Called for EVERY outcome — success, failure,
  // and cancellation — so we always have a record of the checkout attempt.
  const saveOrderToBackend = async ({ paymentIntentId, status, amountPaid, currency, failureReason }) => {
    const payload = {
      courseId: course?._id || course?.id || id,
      courseTitle: course?.title,
      coursePrice: course ? subtotal : undefined,
      couponCode: appliedCoupon?.code,
      discountAmount: course ? discountAmount : undefined,
      finalAmount: course ? finalAmount : amountPaid ?? 0,
      amountPaid: amountPaid ?? null,
      currency: currency || "usd",
      billing,
      paymentIntentId,
      status,
      failureReason,
    };

    console.log("[checkout-order] saving:", payload); // TEMP: remove once confirmed working

    try {
      const res = await checkoutOrderService.saveOrder(payload);
      console.log("[checkout-order] saved successfully:", res?.data); // TEMP: remove once confirmed working
    } catch (err) {
      // Never let a logging failure block the user's checkout flow — but
      // surface the REAL backend error instead of a generic message.
      console.error(
        "[checkout-order] FAILED to save:",
        err.response?.status,
        err.response?.data || err.message
      );
    }
  };

  // Redirects to the confirmation page, first stashing the payment result
  // where the confirmation page can pick it up (see PAYMENT_RESULT_KEY note above).
  const goToConfirmation = (result) => {
    try {
      sessionStorage.setItem(PAYMENT_RESULT_KEY, JSON.stringify(result));
    } catch (err) {
      console.error("Could not persist payment result:", err);
    }
    navigate(`/courses/${id}/checkout/success`);
  };

  // Handle the case where Stripe redirected the browser back here
  // (Klarna / Afterpay / Affirm / 3D Secure) instead of confirming inline.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redirectClientSecret = params.get("payment_intent_client_secret");
    const redirectStatus = params.get("redirect_status");

    if (!redirectClientSecret) {
      setCheckingRedirectStatus(false);
      return;
    }

    (async () => {
      try {
        const stripe = await stripePromise;
        const { paymentIntent } = await stripe.retrievePaymentIntent(
          redirectClientSecret
        );

        if (paymentIntent && paymentIntent.status === "succeeded") {
          try {
            await enrollmentService.enrollSelf(id, {
              paymentIntentId: paymentIntent.id,
            });
          } catch (err) {
            console.error("Enrollment failed after redirect payment:", err);
          }
          await saveOrderToBackend({
            paymentIntentId: paymentIntent.id,
            status: "succeeded",
            amountPaid: (paymentIntent.amount ?? 0) / 100,
            currency: paymentIntent.currency,
          });
          goToConfirmation({
            paymentIntentId: paymentIntent.id,
            amountPaid: (paymentIntent.amount ?? 0) / 100,
            currency: paymentIntent.currency,
            billing,
            appliedCoupon,
          });
          return;
        } else if (redirectStatus === "failed") {
          await saveOrderToBackend({
            paymentIntentId: redirectClientSecret?.split("_secret")[0],
            status: "failed",
            failureReason: "Redirect payment failed.",
          });
          setInitError("Payment failed. Please try again.");
        }
      } catch (err) {
        console.error("Error checking redirect payment status:", err);
      } finally {
        // Clean the query string so a page refresh doesn't re-trigger this
        window.history.replaceState({}, "", window.location.pathname);
        setCheckingRedirectStatus(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const subtotal = Number(course?.price || 0);
  const discountAmount = appliedCoupon ? Number(appliedCoupon.discountAmount || 0) : 0;
  const finalAmount = Math.max(0, subtotal - discountAmount);

  // Create (or re-create) the PaymentIntent whenever the course loads, or whenever
  // the applied coupon changes. This is the key fix: previously this effect only
  // depended on `course`, so applying/removing a coupon updated `finalAmount` on
  // screen but never told Stripe about the new amount — the old PaymentIntent
  // (created for the full course price) was still the one actually charged.
  useEffect(() => {
    if (!course) return;

    const courseId = course._id || course.id;

    if (!courseId) {
      console.error("No course id found on course object:", course);
      setInitError("Could not initialize payment (missing course id).");
      return;
    }

    // Don't try to create a PaymentIntent for a free (100%-off) order.
    if (finalAmount <= 0) {
      setClientSecret(null);
      setPaymentPreparing(false);
      return;
    }

    let cancelled = false;

    const initPayment = async () => {
      setPaymentPreparing(true);
      setInitError(null);
      try {
        const res = await paymentService.createPaymentIntent({
          courseId,
          amount: Math.round(finalAmount * 100), // cents, post-discount
          couponCode: appliedCoupon?.code,
        });

        if (cancelled) return;

        if (!res?.data?.clientSecret) {
          console.error("No clientSecret in response:", res?.data);
          setInitError("Could not initialize payment (no clientSecret returned).");
          return;
        }

        setClientSecret(res.data.clientSecret);
      } catch (err) {
        if (cancelled) return;
        console.error("Payment init error (full):", err);
        setInitError(
          err.response?.data?.error ||
            err.response?.data?.message ||
            `Could not initialize payment${err.response?.status ? ` (status ${err.response.status})` : ""}.`
        );
      } finally {
        if (!cancelled) setPaymentPreparing(false);
      }
    };

    initPayment();

    return () => {
      cancelled = true;
    };
  }, [course, appliedCoupon, finalAmount]);

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      await enrollmentService.enrollSelf(id, {
        paymentIntentId: paymentIntent.id,
        couponCode: appliedCoupon?.code,
      });
    } catch (err) {
      console.error("Enrollment failed after payment:", err);
    }
    const amountPaid = (paymentIntent.amount ?? finalAmount * 100) / 100;
    const currency = paymentIntent.currency || "usd";
    await saveOrderToBackend({
      paymentIntentId: paymentIntent.id,
      status: "succeeded",
      amountPaid,
      currency,
    });
    goToConfirmation({
      paymentIntentId: paymentIntent.id,
      amountPaid,
      currency,
      billing,
      appliedCoupon,
    });
  };

  // Called by StripeCardForm whenever a payment attempt does NOT succeed —
  // covers card declines, cancelled 3DS/redirect flows, and any other
  // unresolved outcome. The attempt is still recorded in the backend.
  const handlePaymentFailure = async ({ paymentIntentId, status, failureReason }) => {
    await saveOrderToBackend({
      paymentIntentId,
      status: status || "failed",
      failureReason,
    });
  };

  if (loading || !course || checkingRedirectStatus) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-3 py-24 text-slate-500">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
        Loading checkout...
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
          <div className="mb-8 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <HiOutlineLockClosed className="h-4 w-4" />
            Secure checkout
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
            <BillingForm
              billing={billing}
              setBilling={setBilling}
              errors={billingErrors}
              fieldRefs={billingFieldRefs}
              onFieldEdited={clearFieldError}
            />

            <OrderSummary
              course={course}
              subtotal={subtotal}
              discountAmount={discountAmount}
              appliedCoupon={appliedCoupon}
              setAppliedCoupon={setAppliedCoupon}
              finalAmount={finalAmount}
              clientSecret={clientSecret}
              paymentPreparing={paymentPreparing}
              initError={initError}
              handlePaymentSuccess={handlePaymentSuccess}
              handlePaymentFailure={handlePaymentFailure}
              billing={billing}
              courseId={id}
              onValidateBilling={validateBilling}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;