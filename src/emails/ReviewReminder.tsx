import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ReviewReminderEmailProps {
  clientName: string;
  caregiverName: string;
  serviceName: string;
  bookingDate: string;
  reviewUrl: string;
}

export default function ReviewReminderEmail({
  clientName = "John Doe",
  caregiverName = "Sarah Johnson",
  serviceName = "Elderly Care",
  bookingDate = "March 5, 2026",
  reviewUrl = "https://care.xyz/my-bookings/123",
}: ReviewReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>How was your experience with {caregiverName}?</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>
              Care<span style={logoAccent}>.xyz</span>
            </Heading>
          </Section>

          <Section style={content}>
            <Heading style={h1}>How was your experience?</Heading>

            <Text style={text}>Hi {clientName},</Text>

            <Text style={text}>
              We hope your {serviceName} service with {caregiverName} on{" "}
              {bookingDate} went well!
            </Text>

            <Text style={text}>
              Your feedback helps us maintain quality and helps other families
              make informed decisions. Would you take a moment to share your
              experience?
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={reviewUrl}>
                Leave a Review
              </Button>
            </Section>

            <Text style={text}>
              Your review will be visible to other families and will help{" "}
              {caregiverName} improve their services.
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              If you have any concerns or issues, please contact our support
              team at{" "}
              <Link href="mailto:support@care.xyz" style={link}>
                support@care.xyz
              </Link>
            </Text>

            <Text style={footer}>
              © 2026 Care.xyz. All rights reserved.
              <br />
              Professional Care Service Platform
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f0fdfa",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 48px",
  borderBottom: "1px solid #e2e8f0",
};

const logo = {
  fontSize: "28px",
  fontWeight: "bold",
  color: "#0f172a",
  margin: "0",
};

const logoAccent = {
  color: "#0d9488",
};

const content = {
  padding: "32px 48px",
};

const h1 = {
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 24px",
  lineHeight: "1.3",
};

const text = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 0",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#0d9488",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 32px",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "32px 0",
};

const footer = {
  color: "#94a3b8",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "8px 0",
};

const link = {
  color: "#0d9488",
  textDecoration: "underline",
};
