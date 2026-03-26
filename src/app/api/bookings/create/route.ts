import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);


    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const {
      serviceId,
      caregiverId,
      startDate,
      durationType,
      durationValue,
      division,
      district,
      city,
      area,
      address,
      specialInstructions,
      totalAmount,
      platformFee,
      baseAmount,
      stripeSessionId,
    } = body;

    
    let actualServiceId = serviceId;
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        serviceId,
      );

    if (!isUUID) {
      const { data: service, error: serviceError } = await supabaseAdmin
        .from("services")
        .select("id")
        .eq("slug", serviceId)
        .single();

      if (serviceError || !service) {
        console.error("Service not found:", serviceError);
        return NextResponse.json(
          { error: "Service not found" },
          { status: 404 },
        );
      }

      actualServiceId = service.id;
    }

    
    const bookingNumber = `BK${Date.now()}`;


    
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .insert({
        booking_number: bookingNumber,
        client_id: session.user.id,
        caregiver_id: caregiverId,
        service_id: actualServiceId,
        start_date: startDate,
        end_date: startDate,
        duration_type: durationType,
        duration_value: parseInt(durationValue),
        division: division,
        district: district,
        city: city,
        area: area,
        address: address || "",
        special_instructions: specialInstructions || "",
        base_amount: baseAmount,
        platform_fee: platformFee,
        total_amount: totalAmount,
        status: "CONFIRMED",
        payment_status: "PAID",
        stripe_payment_id: stripeSessionId,
      })
      .select()
      .single();


    if (bookingError) {
      console.error("Failed to create booking:", bookingError);
      return NextResponse.json(
        { error: "Failed to create booking", details: bookingError },
        { status: 500 },
      );
    }

    
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from("payments")
      .insert({
        booking_id: booking.id,
        stripe_payment_intent_id: stripeSessionId,
        amount: totalAmount,
        platform_fee: platformFee,
        caregiver_payout: baseAmount,
        currency: "usd",
        status: "PAID",
      })
      .select()
      .single();


    if (paymentError) {
      console.error("Warning: Failed to create payment record:", paymentError);
      
    }

    
    const { error: notificationError } = await supabaseAdmin
      .from("notifications")
      .insert([
        {
          user_id: session.user.id,
          title: "Booking Confirmed",
          message: `Your booking #${bookingNumber} has been confirmed!`,
          type: "BOOKING",
          link: `/my-bookings`,
        },
        {
          user_id: caregiverId,
          title: "New Booking",
          message: `You have a new booking #${bookingNumber}`,
          type: "BOOKING",
          link: `/my-bookings`,
        },
      ]);

    if (notificationError) {
      console.error(
        "Warning: Failed to create notifications:",
        notificationError,
      );
      
    }


    return NextResponse.json({ success: true, booking });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create booking";
    console.error("Create booking error:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
