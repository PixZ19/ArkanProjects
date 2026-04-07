import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async headers() {
    return [
      {
        source: "/installer/:path*",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain",
          },
          {
            key: "Content-Disposition",
            value: 'inline; filename="pterodactyl.sh"',
          },
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
