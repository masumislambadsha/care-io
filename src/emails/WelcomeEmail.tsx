import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  role: string;
}

export default function WelcomeEmail({ name, role }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Care.xyz - Your trusted care service platform</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Welcome to Care.xyz! 🎉</Heading>
          <Text style={text}>Hi {name},</Text>
          <Text style={text}>
            Thank you for joining Care.xyz as a {role.toLowerCase()}. We're
            excited to have you on board!
          </Text>
          {role === "CLIENT" && (
            <>
              <Text style={text}>
                You can now browse our verified caregivers and book services for
                your loved ones.
              </Text>
              <Section style={buttonContainer}>
                <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/caregivers`}>
                  Find Caregivers
                </Button>
              </Section>
            </>
          )}
          {role === "CAREGIVER" && (
            <>
              <Text style={text}>
                Your application is currently under review. We'll notify you once
                your account is approved.
              </Text>
              <Text style={text}>
                In the meantime, you can complete your profile and upload your
                certifications.
              </Text>
            </>
          )}
          <Text style={text}>
            If you have any questions, feel free to reach out to our support team.
          </Text>
          <Text style={text}>
            Best regards,
            <br />
            The Care.xyz Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#0d9488",
  fontSize: "32px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
  padding: "0 40px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#0d9488",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

