import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export async function GET() {
  try {
    const { data: services, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      console.error("Error fetching services:", error);
      return NextResponse.json(
        { error: "Failed to fetch services" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { services },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  } catch (error) {
    console.error("Services API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
