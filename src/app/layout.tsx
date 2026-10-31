/**
 * root layout.tsx — Root layout for the entire app.
 * Loads fonts via next/font, wires them to CSS token variables,
 * registers the service worker, and links the PWA manifest.
 */

import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import "./globals.css";

// ---------- Font loading ----------
// Fonts are loaded here and bound to CSS variables used in tokens.css.
// To swap a font, change the import and the variable below — no other file needs to change.

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

// ---------- Metadata ----------

export const metadata: Metadata = {
  title: {
    default: "hivai — Find your people",
    template: "%s | hivai",
  },
  description:
    "Find your campus people, events, and ideas with hivai — a little more connection, a lot more happening.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "hivai",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "hivai",
    title: "hivai — Find your people",
    description:
      "Find campus events, meet your people, and make ideas happen together.",
  },
};

export const viewport: Viewport = {
  themeColor: "#D2A24E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// ---------- Root Layout ----------

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${playfairDisplay.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* iOS standalone web app meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="hivai" />
      </head>
      <body className="font-body antialiased">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
