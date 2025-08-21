/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvas': false,
    };
    return config;
  },
  output: 'standalone',  // Optimized for production
}

module.exports = nextConfig
