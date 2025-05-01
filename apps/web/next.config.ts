import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["@invoicely/ui", "@invoicely/utilities"],
};

export default nextConfig;
