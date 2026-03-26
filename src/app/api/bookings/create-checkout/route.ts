import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe, formatAmountForStripe } from "@/lib/stripe";

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
      endDate,
      durationType,
      durationValue,
      division,
      district,
      city,
      area,
      address,
      specialInstructions,
      baseAmount,
      platformFee,
      totalAmount,
    } = body;

    
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Caregiver Service Booking",
              description: `${durationType} service for ${durationValue} ${durationType.toLowerCase()}`,
            },
            unit_amount: formatAmountForStripe(totalAmount),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/booking/${serviceId}`,
      metadata: {
        userId: session.user.id,
        serviceId,
        caregiverId,
        startDate,
        durationType,
        durationValue: durationValue.toString(),
        division,
        district,
        city,
        area,
      },
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
