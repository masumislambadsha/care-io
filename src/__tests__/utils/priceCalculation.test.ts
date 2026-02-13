describe("Price Calculation", () => {
  const calculateBookingPrice = (
    baseRate: number,
    duration: number,
    durationType: "HOURLY" | "DAILY" | "WEEKLY",
  ) => {
    let baseAmount = 0;

    switch (durationType) {
      case "HOURLY":
        baseAmount = baseRate * duration;
        break;
      case "DAILY":
        baseAmount = baseRate * 24 * duration;
        break;
      case "WEEKLY":
        baseAmount = baseRate * 24 * 7 * duration;
        break;
    }

    const platformFee = baseAmount * 0.15; // 15% platform fee
    const totalAmount = baseAmount + platformFee;

    return {
      baseAmount,
      platformFee,
      totalAmount,
      caregiverEarnings: baseAmount * 0.85, // 85% to caregiver
    };
  };

  it("calculates hourly booking price correctly", () => {
    const result = calculateBookingPrice(10, 4, "HOURLY");

    expect(result.baseAmount).toBe(40);
    expect(result.platformFee).toBe(6);
    expect(result.totalAmount).toBe(46);
    expect(result.caregiverEarnings).toBe(34);
  });

  it("calculates daily booking price correctly", () => {
    const result = calculateBookingPrice(10, 2, "DAILY");

    expect(result.baseAmount).toBe(480); // 10 * 24 * 2
    expect(result.platformFee).toBe(72); // 15% of 480
    expect(result.totalAmount).toBe(552);
    expect(result.caregiverEarnings).toBe(408); // 85% of 480
  });

  it("calculates weekly booking price correctly", () => {
    const result = calculateBookingPrice(10, 1, "WEEKLY");

    expect(result.baseAmount).toBe(1680); // 10 * 24 * 7
    expect(result.platformFee).toBe(252); // 15% of 1680
    expect(result.totalAmount).toBe(1932);
    expect(result.caregiverEarnings).toBe(1428); // 85% of 1680
  });

  it("handles zero duration", () => {
    const result = calculateBookingPrice(10, 0, "HOURLY");

    expect(result.baseAmount).toBe(0);
    expect(result.platformFee).toBe(0);
    expect(result.totalAmount).toBe(0);
    expect(result.caregiverEarnings).toBe(0);
  });

  it("handles decimal rates", () => {
    const result = calculateBookingPrice(12.5, 3, "HOURLY");

    expect(result.baseAmount).toBe(37.5);
    expect(result.platformFee).toBe(5.625);
    expect(result.totalAmount).toBe(43.125);
    expect(result.caregiverEarnings).toBe(31.875);
  });
});
