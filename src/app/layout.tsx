/**
 * root layout.tsx — Root layout for the entire app.
 * Loads fonts via next/font, wires them to CSS token variables,
 * registers the service worker, and links the PWA manifest.
 */

import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
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
    default: "Evently — Student Events Platform",
    template: "%s | Evently",
  },
  description:
    "Create, discover, register for, and manage student events — from school sports days to college hackathons to inter-school MUNs.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Evently",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Evently",
    title: "Evently — Student Events Platform",
    description:
      "Create, discover, register for, and manage student events with AI-powered screening.",
  },
};

export const viewport: Viewport = {
  themeColor: "#D2A24E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
      className={`${playfairDisplay.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* iOS standalone web app meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Evently" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      </head>
      <body className="font-body antialiased">
        {children}
        {/* Service worker registration — runs client-side only */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(console.error);
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
