/**
 * next.config.ts — Next.js configuration.
 * Configures Serwist PWA plugin and general Next.js settings.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ---- Image optimization ---- */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  /* ---- Turbopack CSS handling ---- */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
