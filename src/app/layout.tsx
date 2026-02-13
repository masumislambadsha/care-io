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
});

export const metadata: Metadata = {
  title: "Care.xyz - Trusted Care for Your Loved Ones",
  description:
    "Connect with verified, trusted caregivers for children, elderly, and special-needs individuals. Professional home care services you can rely on.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
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
            // background: isDark ? "#9ECFD4" : "#016B61",
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
