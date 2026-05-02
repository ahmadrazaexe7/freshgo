/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

// Improve image optimization defaults for production
nextConfig.images = {
  ...nextConfig.images,
  formats: ["image/avif", "image/webp"],
  deviceSizes: [320, 420, 768, 1024, 1200, 1600],
  imageSizes: [16, 32, 48, 64, 96, 128, 256]
};

export default nextConfig;

