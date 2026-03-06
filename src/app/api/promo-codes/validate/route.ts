import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { code, bookingAmount } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Promo code is required" },
        { status: 400 },
      );
    }

    // Fetch promo code
    const { data: promoCode, error } = await supabaseAdmin
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !promoCode) {
      return NextResponse.json(
        { error: "Invalid promo code" },
        { status: 404 },
      );
    }

    // Check if expired
    if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Promo code has expired" },
        { status: 400 },
      );
    }

    // Check usage limit
    if (promoCode.max_uses && promoCode.current_uses >= promoCode.max_uses) {
      return NextResponse.json(
        { error: "Promo code usage limit reached" },
        { status: 400 },
      );
    }

    // Calculate discount
    let discountAmount = 0;
    if (promoCode.discount_type === "PERCENTAGE") {
      discountAmount = (bookingAmount * promoCode.discount_value) / 100;
    } else if (promoCode.discount_type === "FIXED") {
      discountAmount = promoCode.discount_value;
    }

    // Ensure discount doesn't exceed booking amount
    discountAmount = Math.min(discountAmount, bookingAmount);

    return NextResponse.json({
      valid: true,
      code: promoCode.code,
      discountType: promoCode.discount_type,
      discountValue: promoCode.discount_value,
      discountAmount,
      finalAmount: bookingAmount - discountAmount,
    });
  } catch (error: any) {
    console.error("Promo code validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate promo code" },
      { status: 500 },
    );
  }
}
