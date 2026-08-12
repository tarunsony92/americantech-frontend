import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { fetchCoupons, removeCoupon } from "./couponSlice";
import CouponFormModal from "./CouponFormModal";

export default function CouponList() {
  const dispatch = useDispatch();
  const { items: coupons, status, error } = useSelector((state) => state.coupons);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const openCreate = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this coupon? This cannot be undone.")) {
      dispatch(removeCoupon(id));
    }
  };

  const formatDiscount = (coupon) =>
    coupon.discountType === "percentage" ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Coupon Management</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-tl-xl rounded-br-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        >
          <Plus size={16} /> New Coupon
        </button>
      </div>

      {status === "loading" && (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" size={18} /> Loading coupons...
        </div>
      )}

      {status === "failed" && <p className="text-sm text-red-500">{error}</p>}

      {status === "succeeded" && (
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Code</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Discount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Scope</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Usage</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Expires</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400">
                    No coupons yet.
                  </td>
                </tr>
              )}
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono font-medium text-gray-800">{coupon.code}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDiscount(coupon)}</td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{coupon.scope}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {coupon.usedCount}
                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        coupon.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => openEdit(coupon)} className="text-sky-600 hover:text-sky-800">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && <CouponFormModal coupon={editingCoupon} onClose={() => setModalOpen(false)} />}
    </div>
  );
}