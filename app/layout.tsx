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

const SITE_URL = "https://pranay.gp";
const SITE_DESC =
  "Pranay Prakash is an engineer building developer tools, most recently the Workflow SDK at Vercel. Writing, projects, talks, and podcasts.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pranay Prakash",
    template: "%s · pranay.gp",
  },
  description: SITE_DESC,
  applicationName: "pranay.gp",
  authors: [{ name: "Pranay Prakash", url: SITE_URL }],
  creator: "Pranay Prakash",
  publisher: "Pranay Prakash",
  keywords: [
    "Pranay Prakash",
    "pranaygp",
    "Workflow SDK",
    "Vercel",
    "Windsor",
    "developer tools",
    "software engineer",
    "durable execution",
    "TypeScript",
    "React",
    "essays",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Pranay Prakash",
    description: SITE_DESC,
    url: SITE_URL,
    siteName: "pranay.gp",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranay Prakash",
    description: SITE_DESC,
    creator: "@pranaygp",
    site: "@pranaygp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD structured data for richer search results.
const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Pranay Prakash",
  url: SITE_URL,
  image: `${SITE_URL}/avatar.jpg`,
  jobTitle: "Software Engineer",
  worksFor: { "@type": "Organization", name: "Vercel" },
  sameAs: [
    "https://x.com/pranaygp",
    "https://github.com/pranaygp",
    "https://www.linkedin.com/in/pranaygp",
    "https://instagram.com/pranaygp",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      </body>
    </html>
  );
}
