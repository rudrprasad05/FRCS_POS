import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "bucket.procyonfiji.com", // your own domain
    ],
  },
  output: "standalone",
};

export default nextConfig;
