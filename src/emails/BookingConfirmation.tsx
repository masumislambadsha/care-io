import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface BookingConfirmationProps {
  clientName: string;
  bookingNumber: string;
  serviceName: string;
  caregiverName: string;
  startDate: string;
  totalAmount: number;
  address: string;
}

export default function BookingConfirmation({
  clientName,
  bookingNumber,
  serviceName,
  caregiverName,
  startDate,
  totalAmount,
  address,
}: BookingConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>Your booking #{bookingNumber} has been confirmed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Booking Confirmed! ✅</Heading>
          <Text style={text}>Hi {clientName},</Text>
          <Text style={text}>
            Your booking has been confirmed. Here are the details:
          </Text>

          <Section style={detailsBox}>
            <Text style={detailLabel}>Booking Number</Text>
            <Text style={detailValue}>{bookingNumber}</Text>

            <Hr style={hr} />

            <Text style={detailLabel}>Service</Text>
            <Text style={detailValue}>{serviceName}</Text>

            <Hr style={hr} />

            <Text style={detailLabel}>Caregiver</Text>
            <Text style={detailValue}>{caregiverName}</Text>

            <Hr style={hr} />

            <Text style={detailLabel}>Date & Time</Text>
            <Text style={detailValue}>
              {new Date(startDate).toLocaleString()}
            </Text>

            <Hr style={hr} />

            <Text style={detailLabel}>Location</Text>
            <Text style={detailValue}>{address}</Text>

            <Hr style={hr} />

            <Text style={detailLabel}>Total Amount</Text>
            <Text style={detailValue}>${totalAmount.toFixed(2)}</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button
              style={button}
              href={`${process.env.NEXT_PUBLIC_APP_URL}/my-bookings`}
            >
              View Booking Details
            </Button>
          </Section>

          <Text style={text}>
            Your caregiver will arrive at the scheduled time. If you need to
            make any changes, please contact us at least 24 hours in advance.
          </Text>

          <Text style={text}>
            Thank you for choosing Care.xyz!
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

const detailsBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "24px",
  margin: "32px 40px",
};

const detailLabel = {
  color: "#64748b",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 4px 0",
};

const detailValue = {
  color: "#0f172a",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0 0 16px 0",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "16px 0",
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
