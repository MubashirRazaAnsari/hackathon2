import { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "http://52.189.66.5/api/:path*",
      },
      {
        source: "/health-check",
        destination: "http://52.189.66.5/health",
      },
    ];
  },
};

export default nextConfig;
