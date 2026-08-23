import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Keep dependency and route discovery inside this application. A lockfile in
  // the parent user directory otherwise makes Next.js infer the wrong root.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
