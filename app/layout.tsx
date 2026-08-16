import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

// Google Tag Manager container ID. GTM loads GA4 (and anything else) via the
// container config at tagmanager.google.com. Override per-env with
// NEXT_PUBLIC_GTM_ID if needed.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-WBGZTJS9";

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
      <GoogleTagManager gtmId={GTM_ID} />
      <body className="min-h-screen">
        <div className="mx-auto max-w-2xl px-6 py-16">
          {children}
        </div>
      </body>
    </html>
  );
}
