import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cloud.appwrite.io",
        protocol: "https",
      },
    ],
  },
  reactStrictMode: false,
}

export default nextConfig
