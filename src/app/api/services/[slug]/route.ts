import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    
    const params = await context.params;

    
    const { data: allServices, error: allError } = await supabaseAdmin
      .from("services")
      .select("id, name, slug")
      .limit(10);

    
    const { data: service, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("slug", params.slug)
      .eq("is_active", true)
      .single();

    if (error || !service) {
      return NextResponse.json(
        {
          error: "Service not found",
          requestedSlug: params.slug,
          availableServices: allServices?.map((s) => s.slug),
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Service API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
