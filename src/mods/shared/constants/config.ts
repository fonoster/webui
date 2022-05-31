import getConfig from 'next/config'

type Config = {
  publicRuntimeConfig: {
    [key: string]: string
    APP_URL: string
    SENTRY_DSN: string
  }
}

export const { publicRuntimeConfig: config } = getConfig() as Config
