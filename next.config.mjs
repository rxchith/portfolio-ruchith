const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/portfolio-ruchith' : '',
  assetPrefix: isProd ? '/portfolio-ruchith/' : '',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  devIndicators: {
    appIsrStatus: false,
  },
  env: {
    googleAnalyticsId: isProd ? process.env.GA_MEASUREMENT_ID : "",
  }
};

export default nextConfig;
