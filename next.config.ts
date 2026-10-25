import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const nextConfig: NextConfig = {};

export default nextConfig;

// Exposes Cloudflare bindings (env vars, secrets) to `next dev`.
initOpenNextCloudflareForDev();
