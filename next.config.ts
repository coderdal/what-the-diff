import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
