import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { code, bookingAmount } = body;

    if (!code || !bookingAmount) {
      return NextResponse.json(
        { error: "Code and booking amount required" },
        { status: 400 },
      );
    }

    
    const { data: promoCode, error } = await supabaseAdmin
      .from("promo_codes")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("is_active", true)
      .single();

    if (error || !promoCode) {
      return NextResponse.json(
        { valid: false, error: "Invalid promo code" },
        { status: 200 },
      );
    }

    
    if (promoCode.expires_at) {
      const expiryDate = new Date(promoCode.expires_at);
      if (expiryDate < new Date()) {
        return NextResponse.json(
          { valid: false, error: "Promo code has expired" },
          { status: 200 },
        );
      }
    }

    
    if (promoCode.max_uses && promoCode.current_uses >= promoCode.max_uses) {
      return NextResponse.json(
        { valid: false, error: "Promo code usage limit reached" },
        { status: 200 },
      );
    }

    
    let discountAmount = 0;
    if (promoCode.discount_type === "PERCENTAGE") {
      discountAmount = (bookingAmount * promoCode.discount_value) / 100;
    } else {
      discountAmount = promoCode.discount_value;
    }

    
    discountAmount = Math.min(discountAmount, bookingAmount);

    return NextResponse.json({
      valid: true,
      code: promoCode.code,
      discountAmount,
      discountType: promoCode.discount_type,
      discountValue: promoCode.discount_value,
    });
  } catch (error) {
    console.error("Promo code validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to validate promo code" },
      { status: 500 },
    );
  }
}
