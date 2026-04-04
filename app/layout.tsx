import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "pranay.gp",
    template: "%s — pranay.gp",
  },
  description: "Pranay Prakash's blog",
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
