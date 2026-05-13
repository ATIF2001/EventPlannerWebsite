/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  async redirects() {
    return [
      { source: '/projects', destination: '/projects/Corporate', permanent: false },
      { source: '/projects/coporate', destination: '/projects/Corporate', permanent: false },
      { source: '/blog', destination: '/blogs', permanent: false },
      { source: '/blog-details', destination: '/blogs', permanent: false },
    ];
  },
};

module.exports = nextConfig;
