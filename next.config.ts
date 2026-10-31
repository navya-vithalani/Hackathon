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
  /* Keep Tailwind's compiler off CSS Modules so Next can scope them natively. */
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.css": {
        condition: {
          path: /src\/app\/globals\.css$/,
        },
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
