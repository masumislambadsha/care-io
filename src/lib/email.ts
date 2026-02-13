import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Care.xyz <onboarding@resend.dev>", // Change this to your verified domain
      to,
      subject,
      react,
    });

    if (error) {
      console.error("Email send error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export default resend;
