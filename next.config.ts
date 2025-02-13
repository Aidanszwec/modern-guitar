import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Allows deployment even with TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Skips ESLint during builds
  },
};

export default nextConfig;
