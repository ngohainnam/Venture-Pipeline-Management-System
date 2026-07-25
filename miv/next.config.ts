import type { NextConfig } from "next";

const backend =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.PUBLIC_BACKEND_URL ||
  "http://localhost:3001";

const allowedDevOrigins = process.env.NEXT_ALLOWED_DEV_ORIGINS
  ?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  images: {
    // Required for the current app because no remote image host allowlist is configured.
    unoptimized: true,
  },
  ...(allowedDevOrigins?.length ? { allowedDevOrigins } : {}),
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: `${backend}/:path*`,
      },
    ];
  },
};

export default nextConfig;
