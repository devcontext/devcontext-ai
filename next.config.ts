import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/.well-known/mcp-configuration",
        destination: "/api/mcp/config",
      },
    ];
  },
};

export default nextConfig;
