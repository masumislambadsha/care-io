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

    const userId = session.user.id;


    
    
    const { data: bookings, error } = await supabaseAdmin
      .from("bookings")
      .select(
        `
        *,
        client:users!bookings_client_id_fkey(id, name, email),
        caregiver:users!bookings_caregiver_id_fkey(id, name, email),
        service:services(id, name)
      `,
      )
      .eq("client_id", userId)
      .order("created_at", { ascending: false });


    if (error) {
      console.error("Error fetching bookings:", error);
      return NextResponse.json(
        { error: "Failed to fetch bookings", details: error },
        { status: 500 },
      );
    }

    
    const transformedBookings = bookings.map((booking: any) => ({
      id: booking.id,
      booking_number: booking.booking_number,
      service_name: booking.service?.name || "Unknown Service",
      caregiver_name: booking.caregiver?.name || "Unknown Caregiver",
      caregiver_id: booking.caregiver?.id || booking.caregiver_id,
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


    return NextResponse.json({ bookings: transformedBookings });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    console.error("Bookings API error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
