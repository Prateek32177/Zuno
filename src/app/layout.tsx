import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toast";
import Preloader from "@/components/Preloader";
import { Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://zunoplan.vercel.app",
  ),

  title: {
    default: "Zipout | Find Plans. Meet peoples.",
    template: "%s | Zipout",
  },

  description:
    "Discover real plans, real people. Join instantly and just show up.",

  applicationName: "Zipout",

  keywords: [
    "group plans",
    "events near me",
    "things to do",
    "meet people",
    "travel groups India",
    "weekend plans",
  ],

  manifest: "/manifest.json",

  openGraph: {
    title: "Find Plans. Join Instantly.",
    description: "Scroll real plans. Join instantly. Show up.",
    url: "/",
    siteName: "Zipout",
    images: [
      {
        url: "/og-image.webp", // make sure this exists
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Find Plans. Join Instantly.",
    description: "Scroll real plans. Join instantly. Show up.",
    images: ["/og-image.webp"],
  },
};

/**
 * ✅ ROOT LAYOUT
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ iOS PWA Fix */}
        <meta name="apple-mobile-web-app-title" content="Zipout" />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className={poppins.className}>
         <Analytics />
        <Preloader />

        <main className="min-h-screen">{children}</main>

        <Toaster />
      </body>
    </html>
  );
}
