/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        // Rewrite root to /home when user has auth cookie
        source: '/testingtesting',
        destination: '/home',
      },
    ];
  },
};

module.exports = nextConfig;
