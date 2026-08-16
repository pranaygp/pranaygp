import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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
    </html>
  );
}
