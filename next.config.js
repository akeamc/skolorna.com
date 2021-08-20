module.exports = {
  async redirects() {
    return [
      {
        source: "/menus/:slug*",
        destination: "/menyer/:slug*",
        permanent: true,
      },
    ];
  },
};
