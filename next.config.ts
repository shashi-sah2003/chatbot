import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_BASE_URL environment variable is not defined');
    }

    return [
      {
        source: "/api/:path*",
        destination: `${baseUrl}/:path*`,
      }
    ]
  }
};

export default nextConfig;
