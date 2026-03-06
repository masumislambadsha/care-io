import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { is_active } = body;

    const { data: promoCode, error } = await supabaseAdmin
      .from("promo_codes")
      .update({ is_active })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating promo code:", error);
      return NextResponse.json(
        { error: "Failed to update promo code" },
        { status: 500 },
      );
    }

    return NextResponse.json({ promoCode });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabaseAdmin
      .from("promo_codes")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting promo code:", error);
      return NextResponse.json(
        { error: "Failed to delete promo code" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
