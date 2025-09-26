import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ClientLayout from "@/components/layout/client-layout";
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
  title: "E-Commerce Store - Your One-Stop Shop",
  description: "Discover amazing products at great prices. Shop electronics, fashion, home goods, and more with fast shipping and excellent customer service.",
  keywords: "e-commerce, online shopping, electronics, fashion, home goods, deals",
  authors: [{ name: "E-Commerce Store" }],

  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "E-Commerce Store - Your One-Stop Shop",
    description: "Discover amazing products at great prices",
    siteName: "E-Commerce Store",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-Commerce Store - Your One-Stop Shop",
    description: "Discover amazing products at great prices",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
