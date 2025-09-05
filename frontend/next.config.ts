import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // !! WARNING !!
    // Allow production builds to complete even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // !! WARNING !!
    // Allow production builds to complete even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
