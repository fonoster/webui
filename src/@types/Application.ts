import type { AppProps as NextAppProps } from 'next/app'

import type { AuthProps } from '.'

export interface AppProps extends Omit<NextAppProps, 'Component'> {
  Component: NextAppProps['Component'] & AuthProps
}

export type Nullable<T> = T | null

export type Handler = () => Promise<unknown>

export type IRequestHandler = Record<string, Handler>
