import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    APP_NAME: process.env.APP_NAME,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL
  }
};

export default nextConfig;
