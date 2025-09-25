// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // DO NOT set: output: "export"
  // DO NOT set: experimental: { appDir: false }
  // DO NOT set: basePath (unless you truly need it)
};

export default nextConfig;
