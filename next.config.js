const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    swSrc: 'public/custom-sw.js', // Path to your custom service worker
  },
  skipWaiting: true,
  register: true,
  cacheStartUrl: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Optimize for standalone deployment
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**', // Local image assets
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // External image source
      },
      {
        protocol: 'https',
        hostname: 'asset.productmarketingcloud.com', // External image source
        port: '80',
        pathname: '/api/assetstorage/**',
      },
    ],
  },
  staticPageGenerationTimeout: 1000, // Timeout for static page generation
  async redirects() {
    return [
      {
        source: '/', // Redirect root to `/en-AU/home`
        destination: '/en-AU/home',
        permanent: true,
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
