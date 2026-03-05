import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Enable ISR with 60 second revalidation
export const revalidate = 60;

export async function GET() {
  try {
    const { data: caregivers, error } = await supabaseAdmin
      .from("users")
      .select(
        `
        *,
        caregiver_profile:caregiver_profiles(*)
      `,
      )
      .eq("role", "CAREGIVER")
      .eq("status", "ACTIVE")
      .not("caregiver_profile", "is", null);

    if (error) {
      console.error("Error fetching caregivers:", error);
      return NextResponse.json(
        { error: "Failed to fetch caregivers" },
        { status: 500 },
      );
    }

    // Transform data to flatten caregiver_profile
    const transformedCaregivers = caregivers.map((caregiver: any) => ({
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
    }));

    return NextResponse.json(
      { caregivers: transformedCaregivers },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  } catch (error) {
    console.error("Caregivers API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
