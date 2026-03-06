import { describe, it, expect } from "@jest/globals";

// Price calculation utility
function calculateBookingPrice(
  hourlyRate: number,
  hours: number,
  platformFeePercent: number = 15,
) {
  const baseAmount = hourlyRate * hours;
  const platformFee = baseAmount * (platformFeePercent / 100);
  const totalAmount = baseAmount + platformFee;
  const caregiverPayout = baseAmount * (1 - platformFeePercent / 100);

  return {
    baseAmount,
    platformFee,
    totalAmount,
    caregiverPayout,
  };
}

describe("Price Calculation", () => {
  it("should calculate correct booking price with default platform fee", () => {
    const result = calculateBookingPrice(50, 4);

    expect(result.baseAmount).toBe(200);
    expect(result.platformFee).toBe(30);
    expect(result.totalAmount).toBe(230);
    expect(result.caregiverPayout).toBe(170);
  });

  it("should calculate correct booking price with custom platform fee", () => {
    const result = calculateBookingPrice(100, 2, 10);

    expect(result.baseAmount).toBe(200);
    expect(result.platformFee).toBe(20);
    expect(result.totalAmount).toBe(220);
    expect(result.caregiverPayout).toBe(180);
  });

  it("should handle zero hours", () => {
    const result = calculateBookingPrice(50, 0);

    expect(result.baseAmount).toBe(0);
    expect(result.platformFee).toBe(0);
    expect(result.totalAmount).toBe(0);
  });

  it("should handle decimal hours", () => {
    const result = calculateBookingPrice(50, 2.5);

    expect(result.baseAmount).toBe(125);
    expect(result.platformFee).toBe(18.75);
    expect(result.totalAmount).toBe(143.75);
  });
});
