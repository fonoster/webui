export const config = Object.freeze({
  /**
   * @todo Look for an option to add this in the CI
   */
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'https://console.fonoster.io',
  SENTRY_DSN:
    process.env.NEXT_PUBLIC_SENTRY_DSN ??
    'https://dafe71c4157a468499ae3146fdb5476a@o1175061.ingest.sentry.io/6271647',
})
