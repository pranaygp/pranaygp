import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Google Analytics measurement/tracking ID.
// NOTE: "UA-142839226-2" is a Universal Analytics ID; Google stopped
// collecting UA data on 2024-07-01, so create a GA4 property ("G-XXXX")
// and set NEXT_PUBLIC_GA_ID in the Vercel env to start collecting again.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "UA-142839226-2";

export const metadata: Metadata = {
  metadataBase: new URL("https://pranay.gp"),
  title: {
    default: "pranay.gp",
    template: "%s — pranay.gp",
  },
  description: "Pranay Prakash's blog",
  openGraph: {
    title: "Pranay Prakash",
    description: "Engineer. Writing, work, and links.",
    url: "https://pranay.gp",
    siteName: "pranay.gp",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@pranaygp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen">
        <div className="mx-auto max-w-2xl px-6 py-16">
          {children}
        </div>
      </body>
      <GoogleAnalytics gaId={GA_ID} />
    </html>
  );
}
