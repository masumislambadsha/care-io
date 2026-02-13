import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { sendEmail } from "@/lib/email";
import WelcomeEmail from "@/emails/WelcomeEmail";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: caregivers, error } = await supabaseAdmin
      .from("caregiver_profiles")
      .select(
        `
        *,
        user:users!caregiver_profiles_user_id_fkey(id, name, email, phone, created_at)
      `,
      )
      .eq("verification_status", "PENDING")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Caregivers fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch caregivers" },
        { status: 500 },
      );
    }

    const transformedCaregivers = caregivers.map((caregiver: any) => ({
      id: caregiver.id,
      user_id: caregiver.user_id,
      name: caregiver.user?.name || "Unknown",
      email: caregiver.user?.email || "",
      phone: caregiver.user?.phone || "",
      bio: caregiver.bio || "",
      experience: caregiver.experience || 0,
      hourly_rate: caregiver.hourly_rate || 0,
      certifications: caregiver.certifications || [],
      languages: caregiver.languages || [],
      services_offered: caregiver.services_offered || [],
      verification_status: caregiver.verification_status,
      created_at: caregiver.user?.created_at || caregiver.created_at,
    }));

    return NextResponse.json({ caregivers: transformedCaregivers });
  } catch (error) {
    console.error("Caregivers fetch error:", error);
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
    const { caregiverId, action, reason } = body;

    if (!caregiverId || !action) {
      return NextResponse.json(
        { error: "Caregiver ID and action are required" },
        { status: 400 },
      );
    }

    // Get caregiver details
    const { data: caregiver, error: fetchError } = await supabaseAdmin
      .from("caregiver_profiles")
      .select("*, user:users!caregiver_profiles_user_id_fkey(name, email)")
      .eq("user_id", caregiverId)
      .single();

    if (fetchError || !caregiver) {
      return NextResponse.json(
        { error: "Caregiver not found" },
        { status: 404 },
      );
    }

    if (action === "approve") {
      // Update verification status to APPROVED
      const { error: updateError } = await supabaseAdmin
        .from("caregiver_profiles")
        .update({ verification_status: "APPROVED" })
        .eq("user_id", caregiverId);

      if (updateError) {
        console.error("Approval error:", updateError);
        return NextResponse.json(
          { error: "Failed to approve caregiver" },
          { status: 500 },
        );
      }

      // Send approval email
      try {
        await sendEmail({
          to: caregiver.user.email,
          subject: "Your Care.xyz Application Has Been Approved! 🎉",
          react: WelcomeEmail({
            name: caregiver.user.name,
            role: "CAREGIVER",
          }),
        });
      } catch (emailError) {
        console.error("Email send error:", emailError);
        // Don't fail the request if email fails
      }

      // Create notification
      await supabaseAdmin.from("notifications").insert({
        user_id: caregiverId,
        type: "CAREGIVER_APPROVED",
        title: "Application Approved!",
        message:
          "Congratulations! Your caregiver application has been approved. You can now start accepting bookings.",
        link: "/caregiver/assigned-jobs",
      });

      return NextResponse.json({
        message: "Caregiver approved successfully",
      });
    } else if (action === "reject") {
      if (!reason) {
        return NextResponse.json(
          { error: "Rejection reason is required" },
          { status: 400 },
        );
      }

      // Update verification status to REJECTED
      const { error: updateError } = await supabaseAdmin
        .from("caregiver_profiles")
        .update({ verification_status: "REJECTED" })
        .eq("user_id", caregiverId);

      if (updateError) {
        console.error("Rejection error:", updateError);
        return NextResponse.json(
          { error: "Failed to reject caregiver" },
          { status: 500 },
        );
      }

      // Create notification
      await supabaseAdmin.from("notifications").insert({
        user_id: caregiverId,
        type: "CAREGIVER_REJECTED",
        title: "Application Update",
        message: `Your caregiver application has been reviewed. Reason: ${reason}`,
      });

      return NextResponse.json({
        message: "Caregiver rejected successfully",
      });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Verification update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
