import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://assets-bucket.deadlock-api.com/**")]
  }
};

export default nextConfig;
