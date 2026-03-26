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

    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("id, name, email, role, status, phone, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 },
      );
    }

    return NextResponse.json({ users });
  } catch (error) {
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
    const { userId, status } = body;

    if (!userId || !status) {
      return NextResponse.json(
        { error: "User ID and status are required" },
        { status: 400 },
      );
    }

    
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot change your own status" },
        { status: 400 },
      );
    }

    const { error } = await supabaseAdmin
      .from("users")
      .update({ status })
      .eq("id", userId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to update user status" },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "User status updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    
    if (userId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 },
      );
    }

    
    

    
    const { data: existingBookings } = await supabaseAdmin
      .from("bookings")
      .select("id, client_id, caregiver_id")
      .or(`client_id.eq.${userId},caregiver_id.eq.${userId}`);

    
    if (existingBookings && existingBookings.length > 0) {
      const bookingIds = existingBookings.map((b) => b.id);
      const { error: paymentsError } = await supabaseAdmin
        .from("payments")
        .delete()
        .in("booking_id", bookingIds);

      if (paymentsError) console.error("Payments error:", paymentsError);
    }

    
    const { error: reviewsError } = await supabaseAdmin
      .from("reviews")
      .delete()
      .or(`author_id.eq.${userId},target_id.eq.${userId}`);

    if (reviewsError) console.error("Reviews error:", reviewsError);

    
    const { data: deletedBookings, error: bookingsError } = await supabaseAdmin
      .from("bookings")
      .delete()
      .or(`client_id.eq.${userId},caregiver_id.eq.${userId}`)
      .select();

    if (bookingsError) {
      return NextResponse.json(
        { error: "Failed to delete bookings: " + bookingsError.message },
        { status: 500 },
      );
    }

    
    const { error: addressesError } = await supabaseAdmin
      .from("addresses")
      .delete()
      .eq("user_id", userId);

    
    const { error: familyError } = await supabaseAdmin
      .from("family_members")
      .delete()
      .eq("user_id", userId);

    
    const { error: profileError } = await supabaseAdmin
      .from("caregiver_profiles")
      .delete()
      .eq("user_id", userId);

    
    const { error: notificationsError } = await supabaseAdmin
      .from("notifications")
      .delete()
      .eq("user_id", userId);

    
    const { error } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId);

    if (error) {
      return NextResponse.json(
        { error: "Failed to delete user: " + error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
