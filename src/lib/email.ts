import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Care XYZ <onboarding@resend.dev>"; 

export async function sendVerificationApprovedEmail(
  to: string,
  caregiverName: string,
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "🎉 Your Caregiver Application Has Been Approved!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin:0 auto;">
          <h1 style="color: #0d9488;">Congratulations, ${caregiverName}!</h1>
          <p style="font-size: 16px; color: #334155;">
            We're excited to inform you that your caregiver application has been approved!
          </p>
          <p style="font-size: 16px; color: #334155;">
            You can now start accepting bookings and providing care services through our platform.
          </p>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard"
               style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <p style="font-size: 14px; color: #64748b;">
            If you have any questions, feel free to contact our support team.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send approval email:", error);
  }
}

export async function sendVerificationRejectedEmail(
  to: string,
  caregiverName: string,
  reason: string,
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Update on Your Caregiver Application",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #334155;">Application Status Update</h1>
          <p style="font-size: 16px; color: #334155;">
            Dear ${caregiverName},
          </p>
          <p style="font-size: 16px; color: #334155;">
            Thank you for your interest in becoming a caregiver on our platform.
            After careful review, we are unable to approve your application at this time.
          </p>
          <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #991b1b; font-weight: 600;">Reason:</p>
            <p style="margin: 8px 0 0 0; color: #7f1d1d;">${reason}</p>
          </div>
          <p style="font-size: 16px; color: #334155;">
            You're welcome to reapply after addressing the concerns mentioned above.
          </p>
          <p style="font-size: 14px; color: #64748b;">
            If you have any questions, please contact our support team.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send rejection email:", error);
  }
}

export async function sendBookingConfirmationEmail(
  to: string,
  bookingDetails: {
    bookingNumber: string;
    clientName: string;
    caregiverName: string;
    serviceName: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
  },
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Booking Confirmed - ${bookingDetails.bookingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0d9488;">Booking Confirmed!</h1>
          <p style="font-size: 16px; color: #334155;">
            Your booking has been confirmed. Here are the details:
          </p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Booking Number:</strong> ${bookingDetails.bookingNumber}</p>
            <p style="margin: 8px 0;"><strong>Service:</strong> ${bookingDetails.serviceName}</p>
            <p style="margin: 8px 0;"><strong>Caregiver:</strong> ${bookingDetails.caregiverName}</p>
            <p style="margin: 8px 0;"><strong>Start Date:</strong> ${new Date(bookingDetails.startDate).toLocaleDateString()}</p>
            <p style="margin: 8px 0;"><strong>End Date:</strong> ${new Date(bookingDetails.endDate).toLocaleDateString()}</p>
            <p style="margin: 8px 0;"><strong>Total Amount:</strong> $${bookingDetails.totalAmount}</p>
          </div>
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_URL}/my-bookings"
               style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              View Booking Details
            </a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send booking confirmation email:", error);
  }
}

export async function sendBookingCancellationEmail(
  to: string,
  bookingDetails: {
    bookingNumber: string;
    serviceName: string;
    refundAmount: number;
  },
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Booking Cancelled - ${bookingDetails.bookingNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #334155;">Booking Cancelled</h1>
          <p style="font-size: 16px; color: #334155;">
            Your booking has been cancelled.
          </p>
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Booking Number:</strong> ${bookingDetails.bookingNumber}</p>
            <p style="margin: 8px 0;"><strong>Service:</strong> ${bookingDetails.serviceName}</p>
            <p style="margin: 8px 0;"><strong>Refund Amount:</strong> $${bookingDetails.refundAmount.toFixed(2)}</p>
          </div>
          <p style="font-size: 16px; color: #334155;">
            The refund will be processed to your original payment method within 5-7 business days.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send cancellation email:", error);
  }
}

export async function sendWelcomeEmail(to: string, name: string, role: string) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Welcome to Care XYZ!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #0d9488;">Welcome to Care XYZ, ${name}!</h1>
          <p style="font-size: 16px; color: #334155;">
            Thank you for joining our platform as a ${role.toLowerCase()}.
          </p>
          ${
            role === "CAREGIVER"
              ? `
          <p style="font-size: 16px; color: #334155;">
            Your application is currently under review. We'll notify you once it's been processed.
          </p>
          `
              : `
          <p style="font-size: 16px; color: #334155;">
            You can now browse caregivers and book services.
          </p>
          `
          }
          <div style="margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_URL}/dashboard"
               style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Get Started
            </a>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}
