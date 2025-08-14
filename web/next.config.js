/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,

  // Optimize images
  images: {
    domains: [],
    formats: ['image/webp', 'image/avif'],
  },

  // Performance optimizations
  experimental: {
    // Enable modern bundling features
    esmExternals: true,
    // Optimize CSS
    optimizeCss: true,
  },

  // Compress responses
  compress: true,

  // Custom webpack configuration for MapLibre GL JS
  webpack: (config, { isServer }) => {
    // Fix for MapLibre GL JS in client-side builds
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    return config;
  },

  // Environment variables
  env: {
    TILES_BASE_URL: process.env.TILES_BASE_URL || '/tiles',
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: '/tiles/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;