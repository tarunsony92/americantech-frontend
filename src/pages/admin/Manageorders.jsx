import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  HiOutlineSearch,
  HiOutlineRefresh,
  HiOutlineX,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineTicket,
  HiOutlineCreditCard,
} from "react-icons/hi";
import checkoutOrderService from "../../services/CheckoutOrderService";
import { formatCurrencyINR } from "../../utils/format";

// ---------------- Status badge ----------------
const STATUS_STYLES = {
  succeeded:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
  failed:
    "bg-red-50 text-red-700 ring-1 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900",
  cancelled:
    "bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
  pending:
    "bg-slate-100 text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
      STATUS_STYLES[status] || STATUS_STYLES.pending
    }`}
  >
    {status || "pending"}
  </span>
);

const STATUS_TABS = [
  { value: "", label: "All" },
  { value: "succeeded", label: "Succeeded" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "pending", label: "Pending" },
];

// ---------------- Order detail drawer ----------------
const OrderDetailDrawer = ({ order, onClose }) => {
  if (!order) return null;
  const fullName = [order.firstName, order.lastName].filter(Boolean).join(" ");
  const fullAddress = [order.address1, order.address2, order.city, order.state, order.zip]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-white shadow-xl dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">Order details</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {order.courseTitle || "—"}
              </p>
              <StatusBadge status={order.status} />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              {order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : "—"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Course price</span>
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {order.coursePrice != null ? formatCurrencyINR(order.coursePrice) : "—"}
              </span>
            </div>
            {order.couponCode && (
              <div className="mt-1.5 flex justify-between text-sm">
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <HiOutlineTicket className="h-3.5 w-3.5" /> {order.couponCode}
                </span>
                <span className="font-medium text-emerald-600">
                  − {formatCurrencyINR(order.discountAmount || 0)}
                </span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900 dark:border-slate-700 dark:text-white">
              <span>Final amount</span>
              <span>{formatCurrencyINR(order.finalAmount)}</span>
            </div>
            {order.status === "succeeded" && (
              <div className="mt-1.5 flex justify-between text-sm">
                <span className="text-slate-500 dark:text-slate-400">Amount paid</span>
                <span className="font-medium text-emerald-600">
                  {formatCurrencyINR(order.amountPaid)}
                </span>
              </div>
            )}
          </div>

          {order.failureReason && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
              {order.failureReason}
            </div>
          )}

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Customer
            </h3>
            <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              {fullName && <p className="font-medium">{fullName}</p>}
              {order.email && (
                <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <HiOutlineMail className="h-4 w-4" /> {order.email}
                </p>
              )}
              {order.phone && (
                <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <HiOutlinePhone className="h-4 w-4" /> {order.phone}
                </p>
              )}
              {fullAddress && (
                <p className="flex items-start gap-2 text-slate-500 dark:text-slate-400">
                  <HiOutlineLocationMarker className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {fullAddress}
                </p>
              )}
              {order.company && (
                <p className="text-slate-500 dark:text-slate-400">Company: {order.company}</p>
              )}
              {order.notes && (
                <p className="rounded-lg bg-slate-50 px-3 py-2 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                  {order.notes}
                </p>
              )}
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Payment reference
            </h3>
            <p className="flex items-center gap-2 break-all font-mono text-xs text-slate-600 dark:text-slate-300">
              <HiOutlineCreditCard className="h-4 w-4 flex-shrink-0 text-slate-400" />
              {order.paymentIntentId || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- Main Page ----------------
const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async (status) => {
    setLoading(true);
    setError(null);
    try {
      const res = await checkoutOrderService.list(status ? { status } : {});
      setOrders(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError(
        err.response?.data?.message || "Could not load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter((o) => {
      const haystack = [
        o.courseTitle,
        o.firstName,
        o.lastName,
        o.email,
        o.phone,
        o.paymentIntentId,
        o.couponCode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [orders, search]);

  const counts = useMemo(() => {
    const c = { succeeded: 0, failed: 0, cancelled: 0, pending: 0 };
    orders.forEach((o) => {
      if (c[o.status] !== undefined) c[o.status] += 1;
    });
    return c;
  }, [orders]);

  return (
    <>
      <Helmet>
        <title>Manage Orders | Admin</title>
      </Helmet>

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Checkout Orders
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Every checkout attempt — succeeded, failed, or cancelled.
            </p>
          </div>
          <button
            onClick={() => fetchOrders(statusFilter)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <HiOutlineRefresh className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { key: "succeeded", label: "Succeeded", color: "text-emerald-600" },
            { key: "failed", label: "Failed", color: "text-red-600" },
            { key: "cancelled", label: "Cancelled", color: "text-amber-600" },
            { key: "pending", label: "Pending", color: "text-slate-500" },
          ].map((s) => (
            <div
              key={s.key}
              className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {s.label}
              </p>
              <p className={`mt-1 text-2xl font-extrabold ${s.color}`}>{counts[s.key]}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  statusFilter === tab.value
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700 dark:hover:bg-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full max-w-xs">
            <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, course, ref..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-800/60">
                <tr>
                  {["Course", "Customer", "Amount", "Coupon", "Status", "Date", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">
                      <span className="mx-auto flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-slate-300 border-t-indigo-500" />
                    </td>
                  </tr>
                )}

                {!loading && error && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-red-500">
                      {error}
                    </td>
                  </tr>
                )}

                {!loading && !error && filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">
                      No orders found.
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  filteredOrders.map((order) => {
                    const fullName = [order.firstName, order.lastName]
                      .filter(Boolean)
                      .join(" ");
                    return (
                      <tr
                        key={order.id || order.paymentIntentId}
                        onClick={() => setSelectedOrder(order)}
                        className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      >
                        <td className="max-w-[220px] truncate px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100">
                          {order.courseTitle || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                          <div className="font-medium text-slate-800 dark:text-slate-100">
                            {fullName || "—"}
                          </div>
                          <div className="text-xs text-slate-400">{order.email}</div>
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {order.status === "succeeded"
                            ? formatCurrencyINR(order.amountPaid)
                            : formatCurrencyINR(order.finalAmount)}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                          {order.couponCode || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-400">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-right text-xs font-medium text-indigo-600">
                          View
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <OrderDetailDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </>
  );
};

export default ManageOrders;