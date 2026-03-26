import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";

    
    if (isAdmin) {
      const session = await getServerSession(authOptions);
      if (session?.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      
      const { data: services, error } = await supabaseAdmin
        .from("services")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching services:", error);
        return NextResponse.json(
          { error: "Failed to fetch services" },
          { status: 500 },
        );
      }

      return NextResponse.json({ services });
    }

    
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
