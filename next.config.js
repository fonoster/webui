/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    APP_URL: process.env.APP_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
    BILLING_URL: process.env.BILLING_URL,
    BANNER_ANNOUNCEMENT: process.env.BANNER_ANNOUNCEMENT,
    FEEDBACK_URL: process.env.FEEDBACK_URL,
  },
}
