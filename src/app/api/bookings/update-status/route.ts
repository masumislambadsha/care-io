import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
      return NextResponse.json(
        { error: "Booking ID and status required" },
        { status: 400 },
      );
    }

    // Validate status
    const validStatuses = ["CONFIRMED", "ONGOING", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Get booking to verify ownership
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Only caregiver can update status
    if (booking.caregiver_id !== session.user.id) {
      return NextResponse.json(
        { error: "Only the assigned caregiver can update booking status" },
        { status: 403 },
      );
    }

    // Update booking status
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    // If marking as completed, set completed_at
    if (status === "COMPLETED") {
      updateData.completed_at = new Date().toISOString();
    }

    const { error: updateError } = await supabaseAdmin
      .from("bookings")
      .update(updateData)
      .eq("id", bookingId);

    if (updateError) {
      console.error("Booking status update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update booking status" },
        { status: 500 },
      );
    }

    // Create notification for client
    await supabaseAdmin.from("notifications").insert({
      user_id: booking.client_id,
      type: "BOOKING_STATUS_UPDATED",
      title: "Booking Status Updated",
      message: `Your booking status has been updated to ${status}`,
      related_id: bookingId,
    });

    return NextResponse.json({
      message: "Booking status updated successfully",
      status,
    });
  } catch (error) {
    console.error("Booking status update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
