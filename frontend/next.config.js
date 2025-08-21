/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvas': false,
    };
    return config;
  },
  output: 'export',  // Enable static export for Render static sites
  trailingSlash: true,
  images: {
    unoptimized: true  // Required for static export
  },
}

module.exports = nextConfig
