import { Toaster } from "@/components/ui/sonner";
import TanstackProvider from "@/context/TanstackProvider";
import { AuthProvider } from "@/context/UserContext";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POS System | Fiji Revenue & Customs",
  description:
    "A modern Point-of-Sale (POS) system tailored for businesses in Fiji. Seamlessly manage sales, inventory, tax compliance, and generate real-time reports across all terminals.",
  keywords: [
    "POS system",
    "Fiji Revenue and Customs",
    "point of sale",
    "inventory management",
    "sales tracking",
    "tax compliance",
    "mobile barcode scanner",
    "refunds and returns",
    "multi-terminal support",
    "real-time reporting",
  ],
  authors: [{ name: "FRCS POS Development Team", url: "https://frcs.org.fj" }],
  creator: "FRCS POS Team",
  openGraph: {
    title: "FRCS POS System | Smart Sales, Easy Compliance",
    description:
      "Efficiently manage your business operations with our advanced POS system designed for compliance, flexibility, and performance.",
    url: "https://frcs.org.fj/pos",
    siteName: "FRCS POS",
    images: [
      {
        url: "https://frcs.org.fj/assets/pos-og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FRCS POS System Dashboard",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FRCS POS System",
    description:
      "Track sales, manage inventory, and stay VAT-compliant with our powerful POS platform built for Fijian businesses.",
    images: ["https://frcs.org.fj/assets/pos-twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // ✅ default to dark
          enableSystem={false} // ❌ don't follow OS preference
        >
          <TanstackProvider>
            <Suspense fallback={<div>Loading session...</div>}>
              <AuthProvider>
                <Toaster />
                {children}
              </AuthProvider>
            </Suspense>
          </TanstackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
