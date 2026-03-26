import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    
    const params = await context.params;

    const { data: caregiver, error } = await supabaseAdmin
      .from("users")
      .select(
        `
        *,
        caregiver_profile:caregiver_profiles(*)
      `,
      )
      .eq("id", params.id)
      .eq("role", "CAREGIVER")
      .eq("status", "ACTIVE")
      .single();

    if (error || !caregiver) {
      return NextResponse.json(
        { error: "Caregiver not found" },
        { status: 404 },
      );
    }

    
    const transformedCaregiver = {
      id: caregiver.id,
      name: caregiver.name,
      email: caregiver.email,
      phone: caregiver.phone,
      image: caregiver.image,
      bio: caregiver.caregiver_profile?.bio || "",
      experience: caregiver.caregiver_profile?.experience || 0,
      hourly_rate: caregiver.caregiver_profile?.hourly_rate || 0,
      certifications: caregiver.caregiver_profile?.certifications || [],
      languages: caregiver.caregiver_profile?.languages || [],
      services_offered: caregiver.caregiver_profile?.services_offered || [],
      verification_status:
        caregiver.caregiver_profile?.verification_status || "PENDING",
      avg_rating: caregiver.caregiver_profile?.avg_rating || 0,
      total_reviews: caregiver.caregiver_profile?.total_reviews || 0,
      total_bookings: caregiver.caregiver_profile?.total_bookings || 0,
    };

    return NextResponse.json({ caregiver: transformedCaregiver });
  } catch (error) {
    console.error("Caregiver API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
