/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  webpack: (config) => {
    // Ensure node-built packages like 'fabric' are bundled for client dynamic imports.
    // Do not mark 'fabric' as an external; let Next.js bundle it.
    return config;
  },
}

module.exports = nextConfig
