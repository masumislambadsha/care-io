import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: promoCodes, error } = await supabaseAdmin
      .from("promo_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching promo codes:", error);
      return NextResponse.json(
        { error: "Failed to fetch promo codes" },
        { status: 500 },
      );
    }

    return NextResponse.json({ promoCodes });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { code, discountType, discountValue, maxUses, expiresAt } = body;

    if (!code || !discountType || !discountValue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const { data: promoCode, error } = await supabaseAdmin
      .from("promo_codes")
      .insert({
        code: code.toUpperCase(),
        discount_type: discountType,
        discount_value: discountValue,
        max_uses: maxUses || null,
        expires_at: expiresAt || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating promo code:", error);
      return NextResponse.json(
        { error: "Failed to create promo code" },
        { status: 500 },
      );
    }

    return NextResponse.json({ promoCode }, { status: 201 });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
