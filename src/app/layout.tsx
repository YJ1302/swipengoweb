import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Swipe N Go Vacations | Your Dream Vacation Awaits",
    template: "%s | Swipe N Go Vacations",
  },
  description: "Discover handpicked destinations, exclusive travel packages, and personalized service. Custom trips, best prices, and trusted service for unforgettable vacation experiences.",
  keywords: ["travel agency", "vacation packages", "custom trips", "travel deals", "destination travel"],
  authors: [{ name: "Swipe N Go Vacations" }],
  openGraph: {
    title: "Swipe N Go Vacations | Your Dream Vacation Awaits",
    description: "Discover handpicked destinations, exclusive travel packages, and personalized service.",
    type: "website",
    locale: "en_US",
    siteName: "Swipe N Go Vacations",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swipe N Go Vacations",
    description: "Your Dream Vacation Awaits",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${cinzel.variable} antialiased bg-slate-900 text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
