import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  HiOutlineUsers,
  HiOutlineBookOpen,
  HiOutlineBriefcase,
  HiOutlineShoppingCart,
} from "react-icons/hi";

import userService from "../../services/userService";
import courseService from "../../services/courseService";
import jobService from "../../services/courseJobService";
import checkoutOrderService from "../../services/CheckoutOrderService";
import auditLogService from "../../services/auditLogService";
import couponService from "../../services/couponService";
import contactQueryService from "../../services/contactQueryService"; // naya file, contactService nahi

const STAT_CONFIG = [
  { key: "users", label: "Total Users", icon: HiOutlineUsers, service: userService },
  { key: "courses", label: "Active Courses", icon: HiOutlineBookOpen, service: courseService },
  { key: "jobs", label: "Open Jobs", icon: HiOutlineBriefcase, service: jobService },
  { key: "orders", label: "Total Orders", icon: HiOutlineShoppingCart, service: checkoutOrderService },
];

const formatDate = (value) => {
  if (!value) return "-";
  try {
    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
};

const TableCard = ({ title, loading, rows, columns, emptyText }) => (
  <div className="card overflow-hidden p-0">
    <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
      <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
    </div>

    {loading ? (
      <p className="px-5 py-6 text-sm text-slate-500">Loading...</p>
    ) : rows.length === 0 ? (
      <p className="px-5 py-6 text-sm text-slate-500">{emptyText}</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-800/50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-3 font-medium">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {rows.map((row, idx) => (
              <tr key={row.id ?? idx}>
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3 text-slate-700 dark:text-slate-300">
                    {col.render ? col.render(row) : row[col.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(
    STAT_CONFIG.reduce((acc, s) => ({ ...acc, [s.key]: 0 }), {})
  );
  const [statsLoading, setStatsLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [auditLogs, setAuditLogs] = useState([]);
  const [auditLoading, setAuditLoading] = useState(true);

  const [coupons, setCoupons] = useState([]);
  const [couponsLoading, setCouponsLoading] = useState(true);

  const [queries, setQueries] = useState([]);
  const [queriesLoading, setQueriesLoading] = useState(true);

  // ===== Stat cards (totals) =====
  // ===== Stat cards (totals) =====
useEffect(() => {
  setStatsLoading(true);

  Promise.allSettled([
    userService.list({ page: 1, limit: 1 }),
    courseService.list({ page: 1, limit: 1 }),
    jobService.list({ page: 1, limit: 1 }),
    checkoutOrderService.list({ page: 1, limit: 9999 }), // total ke liye poora list
  ]).then(([usersRes, coursesRes, jobsRes, ordersRes]) => {
    const next = {};

    next.users =
      usersRes.status === "fulfilled"
        ? usersRes.value.data?.data?.total ?? usersRes.value.data?.meta?.total ?? 0
        : 0;

    next.courses =
      coursesRes.status === "fulfilled"
        ? coursesRes.value.data?.data?.total ?? coursesRes.value.data?.meta?.total ?? 0
        : 0;

    next.jobs =
      jobsRes.status === "fulfilled"
        ? jobsRes.value.data?.data?.total ?? jobsRes.value.data?.meta?.total ?? 0
        : 0;

    next.orders =
      ordersRes.status === "fulfilled"
        ? (ordersRes.value.data?.data?.length ?? 0)
        : 0;

    setStats(next);
    setStatsLoading(false);
  });
}, []);

  // ===== Top 10 recent orders =====
  useEffect(() => {
  checkoutOrderService
    .list({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "DESC" })
    .then(({ data }) => setOrders(data?.data || []))
    .catch(() => setOrders([]))
    .finally(() => setOrdersLoading(false));
}, []);

  // ===== Top 10 recent audit logs =====
  useEffect(() => {
    auditLogService
      .list({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "DESC" })
      .then(({ data }) => setAuditLogs(data?.data?.items || data?.items || []))
      .catch(() => setAuditLogs([]))
      .finally(() => setAuditLoading(false));
  }, []);

  // ===== Top 10 recent coupons =====
  useEffect(() => {
    couponService
      .list()
      .then(({ data }) => {
        const items = data?.data || [];
        setCoupons(items.slice(0, 10));
      })
      .catch(() => setCoupons([]))
      .finally(() => setCouponsLoading(false));
  }, []);

  // ===== Top 10 recent contact queries =====
  useEffect(() => {
    contactQueryService
      .list({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "DESC" })
      .then(({ data }) => setQueries(data?.data?.items || data?.items || []))
      .catch(() => setQueries([]))
      .finally(() => setQueriesLoading(false));
  }, []);

  const displayStats = STAT_CONFIG.map((s) => ({
    ...s,
    value: stats[s.key] || 0,
  }));

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | American FutureTech</title>
      </Helmet>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
        Admin Dashboard
      </h1>

      {/* ===== Stat cards ===== */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {displayStats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <div className="rounded-lg bg-primary-50 p-3 text-primary-600 dark:bg-primary-950">
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {statsLoading ? "..." : s.value.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Top 10 tables ===== */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <TableCard
          title="Recent Contact Queries (Top 10)"
          loading={queriesLoading}
          rows={queries}
          emptyText="No queries found."
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            {
              key: "message",
              label: "Message",
              render: (row) => {
                const text = row.message || row.subject || "-";
                return text.length > 40 ? `${text.slice(0, 40)}...` : text;
              },
            },
            {
              key: "createdAt",
              label: "Date",
              render: (row) => formatDate(row.createdAt),
            },
          ]}
        />
        <TableCard
          title="Recent Coupons (Top 10)"
          loading={couponsLoading}
          rows={coupons}
          emptyText="No coupons found."
          columns={[
            { key: "code", label: "Code" },
            {
              key: "discount",
              label: "Discount",
              render: (row) =>
                row.discountPercent != null
                  ? `${row.discountPercent}%`
                  : row.discountAmount != null
                  ? `₹${row.discountAmount}`
                  : "-",
            },
            {
              key: "isActive",
              label: "Status",
              render: (row) => (row.isActive ? "Active" : "Inactive"),
            },
            {
              key: "createdAt",
              label: "Date",
              render: (row) => formatDate(row.createdAt),
            },
          ]}
        />
        <TableCard
  title="Recent Orders (Top 10)"
  loading={ordersLoading}
  rows={orders}
  emptyText="No orders found."
  columns={[
    { key: "id", label: "Order ID" },
    {
      key: "customer",
      label: "Customer",
      render: (row) =>
        [row.firstName, row.lastName].filter(Boolean).join(" ") || row.email || "-",
    },
    {
      key: "amount",
      label: "Amount",
      render: (row) =>
        row.finalAmount != null
          ? `$${row.finalAmount}`
          : row.amountPaid != null
          ? `$${row.amountPaid}`
          : "-",
    },
    { key: "status", label: "Status" },
    {
      key: "createdAt",
      label: "Date",
      render: (row) => formatDate(row.createdAt),
    },
  ]}
/>

        <TableCard
          title="Recent Audit Logs (Top 10)"
          loading={auditLoading}
          rows={auditLogs}
          emptyText="No audit logs found."
          columns={[
            {
              key: "user",
              label: "User",
              render: (row) => row.user?.fullName || row.user?.email || row.userId || "-",
            },
            { key: "action", label: "Action" },
            {
              key: "createdAt",
              label: "Date",
              render: (row) => formatDate(row.createdAt),
            },
          ]}
        />
      </div>
    </>
  );
};

export default AdminDashboard;