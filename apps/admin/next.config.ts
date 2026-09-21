import type { NextConfig } from 'next';
const config: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const backend = process.env.API_URL?.replace(/\/$/, '');
    return backend ? [{ source: '/api/:path*', destination: `${backend}/:path*` }] : [];
  },
};
export default config;
