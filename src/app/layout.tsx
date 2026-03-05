import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import StyledComponentsRegistry from "@/lib/registry";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Care.xyz - Trusted Care for Your Loved Ones",
    template: "%s | Care.xyz",
  },
  description:
    "Connect with verified, trusted caregivers for children, elderly, and special-needs individuals. Professional home care services you can rely on.",
  keywords: [
    "caregiver",
    "childcare",
    "elderly care",
    "senior care",
    "babysitter",
    "home care",
    "special needs care",
    "professional caregiver",
  ],
  authors: [{ name: "Care.xyz" }],
  creator: "Care.xyz",
  publisher: "Care.xyz",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://care.xyz"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Care.xyz - Trusted Care for Your Loved Ones",
    description:
      "Connect with verified, trusted caregivers for children, elderly, and special-needs individuals.",
    siteName: "Care.xyz",
  },
  twitter: {
    card: "summary_large_image",
    title: "Care.xyz - Trusted Care for Your Loved Ones",
    description:
      "Connect with verified, trusted caregivers for children, elderly, and special-needs individuals.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <StyledComponentsRegistry>
            <SmoothScroll />
            {children}
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 2000,
                style: {
                  color: "black",
                  fontFamily: "inherit",
                  borderRadius: "12px",
                },
              }}
            />
          </StyledComponentsRegistry>
        </Providers>
      </body>
    </html>
  );
}
