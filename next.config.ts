import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Custom Prisma client output lives outside node_modules; ensure engines ship to Vercel.
  outputFileTracingIncludes: {
    "/*": ["./src/generated/prisma/**/*"],
  },
};

export default nextConfig;
