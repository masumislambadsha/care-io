"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface PromoCode {
  id: string;
  code: string;
  discount_type: "PERCENTAGE" | "FIXED";
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminPromoCodesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "ADMIN") {
      router.push("/dashboard");
    } else {
      fetchPromoCodes();
    }
  }, [status, session, router]);

  const fetchPromoCodes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/promo-codes");
      const data = await response.json();
      if (response.ok) {
        setPromoCodes(data.promoCodes || []);
      }
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast.error("Failed to load promo codes");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/promo-codes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        toast.success("Promo code status updated");
        fetchPromoCodes();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">
            Loading promo codes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Promo Codes
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage discount codes for your platform
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <span className="material-icons">add</span>
          Create Promo Code
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {promoCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-slate-400 dark:text-slate-500">
                      <span className="material-icons text-5xl mb-2">
                        discount
                      </span>
                      <p className="text-lg font-medium">No promo codes yet</p>
                      <p className="text-sm">
                        Create your first promo code to get started
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                promoCodes.map((promo) => (
                  <tr
                    key={promo.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400">
                        {promo.code}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-900 dark:text-white font-semibold">
                        {promo.discount_type === "PERCENTAGE"
                          ? `${promo.discount_value}%`
                          : `৳${promo.discount_value}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 dark:text-slate-400">
                        {promo.current_uses}
                        {promo.max_uses ? ` / ${promo.max_uses}` : " / ∞"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-600 dark:text-slate-400">
                        {promo.expires_at
                          ? new Date(promo.expires_at).toLocaleDateString()
                          : "Never"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          promo.is_active
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        }`}
                      >
                        {promo.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(promo.id, promo.is_active)}
                        className="text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 font-medium text-sm"
                      >
                        {promo.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
