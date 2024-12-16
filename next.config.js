const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
  skipWaiting: true,
  register: true,
  cacheStartUrl: true
});


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: 'localhost',
          port: '1337',
          pathname: '/uploads/**',
        },
        {
          protocol: 'https',
          hostname: 'upload.wikimedia.org',
        },
        {
          protocol: 'https',
          hostname: 'https://asset.productmarketingcloud.com',
          port: '80',
          pathname: '/api/assetstorage/**',
        }
      ],
    },
    staticPageGenerationTimeout: 1000,
    async redirects() {
      return [
        {
          source: '/',
          destination: '/en-AU/home',
          permanent: true,
        },
      ]
    },
};

module.exports = withPWA(nextConfig);