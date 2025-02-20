/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploads-ssl.webflow.com'
      },
      {
        protocol: 'https',
        hostname: 'd2e6b8w31txsjq.cloudfront.net'
      },
      {
        protocol: 'https',
        hostname: 'cdn.prod.website-files.com'
      },
      {
        protocol: 'https',
        hostname: 'docs.inkonchain.com'
      },
      {
        protocol: 'https',
        hostname: 'haust.network'
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'blockscout-icons.s3.us-east-1.amazonaws.com'
      },
      {
        protocol: 'https',
        hostname: 'blockscout-icons.s3.amazonaws.com'
      }
    ]
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule) => rule.test && rule.test instanceof RegExp && rule.test.test('.svg')
    );

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/;
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;
