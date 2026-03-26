import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      slug,
      description,
      short_description,
      base_hourly_rate,
      base_daily_rate,
    } = body;

    if (
      !name ||
      !slug ||
      !description ||
      !short_description ||
      !base_hourly_rate ||
      !base_daily_rate
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    
    const { data: existing } = await supabaseAdmin
      .from("services")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Service with this slug already exists" },
        { status: 400 },
      );
    }

    const { data: service, error } = await supabaseAdmin
      .from("services")
      .insert({
        name,
        slug,
        description,
        short_description,
        base_hourly_rate,
        base_daily_rate,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Service creation error:", error);
      return NextResponse.json(
        { error: "Failed to create service" },
        { status: 500 },
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Service creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
