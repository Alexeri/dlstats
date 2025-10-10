import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets-bucket.deadlock-api.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "assets.deadlock-api.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
