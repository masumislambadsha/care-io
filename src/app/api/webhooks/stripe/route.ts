import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";
import { stripe } from "@/lib/stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    // If webhook secret is configured, verify the signature
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 400 },
        );
      }
    } else {
      // For local development without webhook secret, parse the body directly
      event = JSON.parse(body) as Stripe.Event;
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata!;

      // Generate booking number
      const bookingNumber = `BK${Date.now()}`;

      // Calculate amounts
      const totalAmount = session.amount_total! / 100; // Convert from cents
      const platformFee = totalAmount * 0.1;
      const baseAmount = totalAmount - platformFee;

      // Create booking in database
      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert({
          booking_number: bookingNumber,
          client_id: metadata.userId,
          caregiver_id: metadata.caregiverId,
          service_id: metadata.serviceId,
          start_date: metadata.startDate,
          end_date: metadata.startDate, // Will be calculated based on duration
          duration_type: metadata.durationType,
          duration_value: parseInt(metadata.durationValue),
          division: metadata.division,
          district: metadata.district,
          city: metadata.city,
          area: metadata.area,
          address: metadata.address || "",
          base_amount: baseAmount,
          platform_fee: platformFee,
          total_amount: totalAmount,
          status: "CONFIRMED",
          payment_status: "PAID",
          stripe_payment_id: session.payment_intent as string,
        })
        .select()
        .single();

      if (bookingError) {
        console.error("Failed to create booking:", bookingError);
        return NextResponse.json(
          { error: "Failed to create booking" },
          { status: 500 },
        );
      }

      // Create payment record
      await supabase.from("payments").insert({
        booking_id: booking.id,
        stripe_payment_intent_id: session.payment_intent as string,
        amount: totalAmount,
        platform_fee: platformFee,
        caregiver_payout: baseAmount,
        currency: "usd",
        status: "PAID",
      });

      // Create notifications for client and caregiver
      await supabase.from("notifications").insert([
        {
          user_id: metadata.userId,
          title: "Booking Confirmed",
          message: `Your booking #${bookingNumber} has been confirmed!`,
          type: "BOOKING",
          link: `/bookings/${booking.id}`,
        },
        {
          user_id: metadata.caregiverId,
          title: "New Booking",
          message: `You have a new booking #${bookingNumber}`,
          type: "BOOKING",
          link: `/bookings/${booking.id}`,
        },
      ]);

      console.log("Booking created successfully:", bookingNumber);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: error.message || "Webhook handler failed" },
      { status: 500 },
    );
  }
}
