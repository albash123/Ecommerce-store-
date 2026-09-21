import type { NextConfig } from 'next';
const config: NextConfig = {
  transpilePackages: ['@vanta/types'],
  poweredByHeader: false,
  async rewrites() {
    const backend = process.env.API_URL?.replace(/\/$/, '');
    return backend ? [{ source: '/api/:path*', destination: `${backend}/:path*` }] : [];
  },
};
export default config;
