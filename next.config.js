const { i18n } = require("./next-i18next.config");

module.exports = {
  target: "experimental-serverless-trace",
  i18n,
  env: {
    HOSTNAME: process.env.HOSTNAME,
    SHORT_CUTS_DYNAMO_DB_TABLE: process.env.SHORT_CUTS_DYNAMO_DB_TABLE,
    SHORT_CUTS_AWS_REGION: process.env.SHORT_CUTS_AWS_REGION,
    SHORT_CUTS_AWS_ACCESS_KEY: process.env.SHORT_CUTS_AWS_ACCESS_KEY,
    SHORT_CUTS_AWS_SECRET_ACCESS_KEY:
      process.env.SHORT_CUTS_AWS_SECRET_ACCESS_KEY,
    SHORT_CUTS_URL_BUCKET: process.env.SHORT_CUTS_URL_BUCKET,
  },
};
