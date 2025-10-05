import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "bucket.procyonfiji.com", // your own domain
      "frcs.blob.core.windows.net",
    ],
  },
  output: "standalone",
};

export default nextConfig;
