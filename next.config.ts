import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Product/collection media is uploaded to Cloudinary via /api/uploads/cloudinary.
    // `images.domains` is deprecated in Next 16 — remotePatterns is the supported form.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Enables React's <ViewTransition> during route navigations (page transitions).
    viewTransition: true,
  },
};

export default nextConfig;
