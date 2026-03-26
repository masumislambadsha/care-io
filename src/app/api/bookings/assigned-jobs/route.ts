import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    if (session.user.role !== "CAREGIVER") {
      return NextResponse.json(
        { error: "Only caregivers can access assigned jobs" },
        { status: 403 },
      );
    }

    const userId = session.user.id;

    
    const { data: bookings, error } = await supabaseAdmin
      .from("bookings")
      .select(
        `
        *,
        client:users!bookings_client_id_fkey(id, name, email),
        service:services(id, name)
      `,
      )
      .eq("caregiver_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching assigned jobs:", error);
      return NextResponse.json(
        { error: "Failed to fetch assigned jobs", details: error },
        { status: 500 },
      );
    }

    
    const transformedJobs = bookings.map((booking: any) => ({
      id: booking.id,
      booking_number: booking.booking_number,
      service_name: booking.service?.name || "Unknown Service",
      client_name: booking.client?.name || "Unknown Client",
      start_date: booking.start_date,
      end_date: booking.end_date,
      duration_type: booking.duration_type,
      duration_value: booking.duration_value,
      total_amount: booking.total_amount,
      status: booking.status,
      payment_status: booking.payment_status,
      division: booking.division,
      district: booking.district,
      city: booking.city,
      area: booking.area,
      address: booking.address,
      full_address: [
        booking.address,
        booking.area,
        booking.city,
        booking.district,
        booking.division,
      ]
        .filter(Boolean)
        .join(", "),
    }));

    return NextResponse.json({ jobs: transformedJobs });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Assigned jobs API error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
