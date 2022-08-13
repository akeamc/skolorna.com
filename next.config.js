const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/**
 * @type {import('next').NextConfig}
 */
module.exports = (phase) => {
  return {
    i18n: {
      locales: ["sv"],
      defaultLocale: "sv",
    },
    env: {
      ENABLE_GOOGLE_ANALYTICS: phase !== PHASE_DEVELOPMENT_SERVER,
    },
  };
};
