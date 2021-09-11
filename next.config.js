const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

module.exports = (phase) => {
  return {
    env: {
      ENABLE_GOOGLE_ANALYTICS: phase !== PHASE_DEVELOPMENT_SERVER,
    },
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
};
