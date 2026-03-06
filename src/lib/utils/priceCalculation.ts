export interface PriceBreakdown {
  baseAmount: number;
  platformFee: number;
  discount: number;
  totalAmount: number;
  caregiverPayout: number;
}

export function calculateBookingPrice(
  hourlyRate: number,
  hours: number,
  platformFeePercent: number = 15,
  discount: number = 0,
): PriceBreakdown {
  const baseAmount = hourlyRate * hours;
  const platformFee = baseAmount * (platformFeePercent / 100);
  const subtotal = baseAmount + platformFee;
  const totalAmount = Math.max(0, subtotal - discount);
  const caregiverPayout = baseAmount * (1 - platformFeePercent / 100);

  return {
    baseAmount: parseFloat(baseAmount.toFixed(2)),
    platformFee: parseFloat(platformFee.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    totalAmount: parseFloat(totalAmount.toFixed(2)),
    caregiverPayout: parseFloat(caregiverPayout.toFixed(2)),
  };
}

export function formatCurrency(
  amount: number,
  currency: string = "BDT",
): string {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function calculateDailyRate(
  hourlyRate: number,
  hoursPerDay: number = 8,
): number {
  return hourlyRate * hoursPerDay;
}

export function calculateWeeklyRate(
  hourlyRate: number,
  hoursPerWeek: number = 40,
): number {
  return hourlyRate * hoursPerWeek;
}
