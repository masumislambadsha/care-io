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
    const { bookingId, caregiverId, rating, comment } = body;

    
    if (!bookingId || !caregiverId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .eq("client_id", session.user.id)
      .eq("status", "COMPLETED")
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking not found or not completed" },
        { status: 404 },
      );
    }

    
    const { data: existingReview } = await supabaseAdmin
      .from("reviews")
      .select("id")
      .eq("booking_id", bookingId)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: "Review already exists for this booking" },
        { status: 400 },
      );
    }

    
    const { data: review, error: reviewError } = await supabaseAdmin
      .from("reviews")
      .insert({
        booking_id: bookingId,
        author_id: session.user.id,
        target_id: caregiverId,
        rating,
        comment,
      })
      .select()
      .single();

    if (reviewError) {
      console.error("Review creation error:", reviewError);
      return NextResponse.json(
        { error: "Failed to create review" },
        { status: 500 },
      );
    }

    
    const { data: reviews } = await supabaseAdmin
      .from("reviews")
      .select("rating")
      .eq("target_id", caregiverId);

    if (reviews && reviews.length > 0) {
      const avgRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      await supabaseAdmin
        .from("caregiver_profiles")
        .update({
          avg_rating: avgRating,
          total_reviews: reviews.length,
        })
        .eq("user_id", caregiverId);
    }

    return NextResponse.json({
      review,
      message: "Review submitted successfully",
    });
  } catch (error) {
    console.error("Review creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const caregiverId = searchParams.get("caregiverId");

    if (!caregiverId) {
      return NextResponse.json(
        { error: "Caregiver ID required" },
        { status: 400 },
      );
    }

    const { data: reviews, error } = await supabaseAdmin
      .from("reviews")
      .select(
        `
        *,
        author:users!reviews_author_id_fkey(name, image)
      `,
      )
      .eq("target_id", caregiverId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Reviews fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 },
      );
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
