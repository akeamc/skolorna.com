/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  redirects: async () => {
    return [
      {
        source: "/schedule",
        destination: "/schema",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
