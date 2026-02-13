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

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Bookings fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch bookings" },
        { status: 500 },
      );
    }

    const transformedBookings = bookings.map((booking: any) => ({
      id: booking.id,
      booking_number: booking.booking_number,
      client_name: booking.client?.name || "Unknown",
      caregiver_name: booking.caregiver?.name || "Unknown",
      service_name: booking.service?.name || "Unknown",
      start_date: booking.start_date,
      end_date: booking.end_date,
      total_amount: booking.total_amount,
      status: booking.status,
      payment_status: booking.payment_status,
      created_at: booking.created_at,
    }));

    return NextResponse.json({ bookings: transformedBookings });
  } catch (error) {
    console.error("Bookings fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "Booking ID and status are required" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", bookingId);

    if (error) {
      console.error("Booking status update error:", error);
      return NextResponse.json(
        { error: "Failed to update booking status" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Booking status updated successfully",
    });
  } catch (error) {
    console.error("Booking status update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
