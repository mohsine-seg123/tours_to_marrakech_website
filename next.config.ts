import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    qualities: [60, 65, 70, 75, 80, 85, 90, 95, 100],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 64, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
