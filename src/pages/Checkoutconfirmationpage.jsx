import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import jsPDF from "jspdf";
import {
  HiCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineDownload,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineOfficeBuilding,
  HiOutlineDocumentText,
  HiOutlineCalendar,
  HiOutlineCreditCard,
  HiOutlineTicket,
} from "react-icons/hi";
import courseService from "../services/courseService";
import useResourceItem from "../hooks/useResourceItem";
import { formatCurrencyUSD } from "../utils/format";

// Must match the key CheckoutPage.jsx writes to before navigating here.
const PAYMENT_RESULT_KEY = "checkout:lastPaymentResult";

// ---------------- Receipt PDF ----------------
const downloadReceiptPdf = ({ course, pr }) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 56;

  const isRegistration = pr?.orderType === "registration";

  // Header band
  doc.setFillColor(79, 70, 229); // indigo-600
  doc.rect(0, 0, pageWidth, 90, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("American FutureTech", margin, 42);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(isRegistration ? "Registration Payment Receipt" : "Payment Receipt", margin, 62);

  y = 130;
  doc.setTextColor(30, 30, 30);

  const dateStr = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const sectionTitle = (title) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(79, 70, 229);
    doc.text(title, margin, y);
    y += 8;
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 22;
    doc.setTextColor(30, 30, 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
  };

  const row = (label, value, opts = {}) => {
    if (!value) return;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(label, margin, y);
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setTextColor(30, 30, 30);
    const valueLines = doc.splitTextToSize(String(value), pageWidth - margin * 2 - 160);
    doc.text(valueLines, pageWidth - margin, y, { align: "right" });
    y += 20 * valueLines.length;
  };

  sectionTitle("Payment Details");
  row("Receipt date", dateStr);
  row("Payment type", isRegistration ? "Registration Payment" : "Full Course Payment");
  row("Course", course.title);
  row("Course price", formatCurrencyUSD(course.price));
  if (pr?.appliedCoupon) {
    row(
      `Coupon (${pr.appliedCoupon.code})`,
      `− ${formatCurrencyUSD(pr.appliedCoupon.discountAmount || 0)}`
    );
  }
  y += 4;
  row("Amount paid", formatCurrencyUSD(pr?.amountPaid ?? course.price), { bold: true });
  row("Payment reference", pr?.paymentIntentId || "—");
  row("Status", "Succeeded");

  y += 16;

  if (pr?.billing) {
    const b = pr.billing;
    const fullName = [b.firstName, b.lastName].filter(Boolean).join(" ");
    const fullAddress = [b.address1, b.address2, b.city, b.state, b.zip]
      .filter(Boolean)
      .join(", ");

    sectionTitle("Billing Details");
    row("Name", fullName);
    row("Company", b.company);
    row("Email", b.email);
    row("Phone", b.phone);
    row("Address", fullAddress);
    row("Notes", b.notes);
  }

  y = doc.internal.pageSize.getHeight() - 60;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text(
    "This is a system-generated receipt and does not require a signature.",
    margin,
    y + 18
  );

  doc.save(`Receipt-${pr?.paymentIntentId || "payment"}.pdf`);
};

const InfoRow = ({ icon: Icon, label, value, mono }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p
          className={`mt-0.5 break-words text-sm font-medium text-slate-800 dark:text-slate-100 ${
            mono ? "font-mono text-xs" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

// ---------------- Main Confirmation Page ----------------
const CheckoutConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item: course, loading } = useResourceItem(courseService, id);

  // paymentResult stays null if the user landed here directly (e.g. hard
  // refresh after sessionStorage was already read/cleared, or no purchase
  // was made) — the UI below degrades gracefully in that case.
  const [paymentResult, setPaymentResult] = useState(null);
  const [resultChecked, setResultChecked] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(PAYMENT_RESULT_KEY);
      if (raw) {
        setPaymentResult(JSON.parse(raw));
        // Read-once: clear it so a manual refresh doesn't confusingly keep
        // showing stale payment info from a previous purchase.
        sessionStorage.removeItem(PAYMENT_RESULT_KEY);
      }
    } catch (err) {
      console.error("Could not read payment result:", err);
    } finally {
      setResultChecked(true);
    }
  }, []);

  if (loading || !course || !resultChecked) {
    return (
      <div className="container-page flex min-h-[60vh] flex-col items-center justify-center gap-3 py-24 text-slate-500">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-500" />
        Loading confirmation...
      </div>
    );
  }

  const pr = paymentResult;
  // "registration" -> only the registration amount was paid.
  // Anything else (including no orderType at all, e.g. old sessionStorage
  // payloads saved before this field existed) is treated as a full payment.
  const isRegistration = pr?.orderType === "registration";
  const b = pr?.billing;
  const fullName = [b?.firstName, b?.lastName].filter(Boolean).join(" ");
  const fullAddress = [b?.address1, b?.address2, b?.city, b?.state, b?.zip]
    .filter(Boolean)
    .join(", ");
  const receiptDate = new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      <Helmet>
        <title>
          {isRegistration ? "Registration Confirmed" : "Order Confirmed"} — {course.title} | American FutureTech
        </title>
      </Helmet>

      <div className="min-h-[80vh] bg-gradient-to-b from-emerald-50/60 via-slate-50 to-slate-50 py-12 dark:from-emerald-950/10 dark:via-slate-950 dark:to-slate-950">
        <div className="container-page">
          <div className="mx-auto max-w-3xl">
            {/* Hero */}
            <div className="flex flex-col items-center text-center">
              <span className="relative flex h-24 w-24 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/30" />
                <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
                  <HiCheckCircle className="h-11 w-11 text-white" />
                </span>
              </span>
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Payment Successful!
              </h1>
              <p className="mt-2 max-w-md text-slate-600 dark:text-slate-300">
                {isRegistration ? (
                  <>
                    You've paid the registration amount for{" "}
                    <strong>{course.title}</strong>. Complete the full payment
                    anytime from your dashboard to unlock full course access.
                  </>
                ) : (
                  <>
                    You're enrolled in <strong>{course.title}</strong>. A
                    confirmation has been recorded — check your dashboard for
                    course access.
                  </>
                )}
              </p>
            </div>

            {/* Amount hero card */}
            <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-6 text-white shadow-lg shadow-indigo-500/20 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-indigo-100">
                    {isRegistration ? "Registration amount paid" : "Amount paid"}
                  </p>
                  <p className="mt-1 text-4xl font-extrabold tracking-tight">
                    {pr ? formatCurrencyUSD(pr.amountPaid) : formatCurrencyUSD(course.price)}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                    <HiCheckCircle className="h-4 w-4" /> Succeeded
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                      isRegistration
                        ? "bg-amber-400/90 text-amber-950"
                        : "bg-emerald-400/90 text-emerald-950"
                    }`}
                  >
                    {isRegistration ? "Registration Only" : "Full Payment"}
                  </span>
                </div>
              </div>
              {pr?.appliedCoupon && (
                <p className="mt-3 text-sm text-indigo-100">
                  Course price {formatCurrencyUSD(course.price)} − coupon{" "}
                  <span className="font-semibold text-white">
                    {pr.appliedCoupon.code}
                  </span>{" "}
                  ({formatCurrencyUSD(pr.appliedCoupon.discountAmount || 0)} off)
                </p>
              )}
            </div>

            {/* Details card */}
            <div className="mt-6 rounded-2xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800 sm:px-8">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Payment details
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-x-6 px-6 py-2 sm:grid-cols-2 sm:px-8">
                <InfoRow
                  icon={HiOutlineDocumentText}
                  label="Payment type"
                  value={isRegistration ? "Registration Payment" : "Full Course Payment"}
                />
                <InfoRow icon={HiOutlineDocumentText} label="Course" value={course.title} />
                <InfoRow icon={HiOutlineCalendar} label="Date" value={receiptDate} />
                <InfoRow
                  icon={HiOutlineCreditCard}
                  label="Payment reference"
                  value={pr?.paymentIntentId}
                  mono
                />
                <InfoRow
                  icon={HiOutlineTicket}
                  label="Coupon applied"
                  value={pr?.appliedCoupon ? pr.appliedCoupon.code : null}
                />
              </div>

              {b && (
                <>
                  <div className="border-y border-slate-100 px-6 py-5 dark:border-slate-800 sm:px-8">
                    <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Billing details
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 px-6 py-2 sm:grid-cols-2 sm:px-8">
                    <InfoRow icon={HiOutlineOfficeBuilding} label="Name" value={fullName} />
                    <InfoRow icon={HiOutlineOfficeBuilding} label="Company" value={b.company} />
                    <InfoRow icon={HiOutlineMail} label="Email" value={b.email} />
                    <InfoRow icon={HiOutlinePhone} label="Phone" value={b.phone} />
                    <InfoRow
                      icon={HiOutlineLocationMarker}
                      label="Address"
                      value={fullAddress}
                    />
                    <InfoRow icon={HiOutlineDocumentText} label="Order notes" value={b.notes} />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-3 px-6 py-6 sm:flex-row sm:px-8">
                <button
                  onClick={() => downloadReceiptPdf({ course, pr })}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/70"
                >
                  <HiOutlineDownload className="h-4.5 w-4.5" />
                  Download receipt (PDF)
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-90"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>

            <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
              <HiOutlineShieldCheck className="h-4 w-4" />
              This payment was processed securely by Stripe.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutConfirmationPage;