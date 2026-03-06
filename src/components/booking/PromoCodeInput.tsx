"use client";

import { useState } from "react";
import toast from "react-hot-toast";

interface PromoCodeInputProps {
  bookingAmount: number;
  onApply: (discount: number, code: string) => void;
}

export function PromoCodeInput({
  bookingAmount,
  onApply,
}: PromoCodeInputProps) {
  const [code, setCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const handleApply = async () => {
    if (!code.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsValidating(true);

    try {
      const response = await fetch("/api/promo-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), bookingAmount }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        toast.success(
          `Promo code applied! You saved ৳${data.discountAmount.toFixed(2)}`,
        );
        setAppliedCode(data.code);
        onApply(data.discountAmount, data.code);
      } else {
        toast.error(data.error || "Invalid promo code");
      }
    } catch (error) {
      toast.error("Failed to validate promo code");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemove = () => {
    setCode("");
    setAppliedCode(null);
    onApply(0, "");
    toast.success("Promo code removed");
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
        Promo Code (Optional)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter promo code"
          disabled={!!appliedCode || isValidating}
          className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 dark:bg-slate-900 dark:text-white"
        />
        {appliedCode ? (
          <button
            type="button"
            onClick={handleRemove}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            onClick={handleApply}
            disabled={isValidating || !code.trim()}
            className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? "Validating..." : "Apply"}
          </button>
        )}
      </div>
      {appliedCode && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <span className="material-icons text-base">check_circle</span>
          <span>Promo code "{appliedCode}" applied successfully</span>
        </div>
      )}
    </div>
  );
}
