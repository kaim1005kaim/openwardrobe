import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds on Vercel for now
    ignoreDuringBuilds: true,
  },
  typescript: {
    // We'll handle TypeScript errors separately
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: '*.imagineapi.dev',
      },
    ],
  },
};

export default nextConfig;
