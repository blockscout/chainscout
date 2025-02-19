/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'uploads-ssl.webflow.com',
      'd2e6b8w31txsjq.cloudfront.net',
      'cdn.prod.website-files.com',
      'docs.inkonchain.com',
      'haust.network',
      'avatars.githubusercontent.com',
      'blockscout-icons.s3.us-east-1.amazonaws.com',
      'uploads-ssl.webflow.com',
    ],
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
