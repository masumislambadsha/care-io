import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "CAREGIVER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: profile, error } = await supabaseAdmin
      .from("caregiver_profiles")
      .select("availability")
      .eq("user_id", session.user.id)
      .single();

    if (error) {
      console.error("Availability fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch availability" },
        { status: 500 },
      );
    }

    return NextResponse.json({ availability: profile?.availability || null });
  } catch (error) {
    console.error("Availability fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "CAREGIVER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { availability } = body;

    if (!availability) {
      return NextResponse.json(
        { error: "Availability data is required" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("caregiver_profiles")
      .update({ availability })
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Availability update error:", error);
      return NextResponse.json(
        { error: "Failed to update availability" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "Availability updated successfully" });
  } catch (error) {
    console.error("Availability update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
