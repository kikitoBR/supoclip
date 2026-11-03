import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_BUILD_DIR || ".next",
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Self-hosting articles were retired; send old links somewhere useful.
  async redirects() {
    return [
      { source: "/open-source-video-clipper", destination: "/ai-video-clipper", permanent: true },
      { source: "/blog/self-host-supoclip-docker", destination: "/", permanent: true },
      { source: "/blog/supoclip-vs-supo-live", destination: "/blog/supoclip-vs-opusclip", permanent: true },
      { source: "/blog/best-free-opusclip-alternative", destination: "/blog/supoclip-vs-opusclip", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/js/script.js",
        destination: "https://datafa.st/js/script.js",
      },
      {
        source: "/api/events",
        destination: "https://datafa.st/api/events",
      },
    ];
  },
};

export default nextConfig;
