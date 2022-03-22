import { DefaultOptions, QueryClient } from 'react-query'

// 0.5 Hours
const DEFAULT_TIME = 1000 * 60 * 60 * 0.5

/**
 * React Query Options
 * @summary Set the config on all queries and mutations through the client.
 *
 * @author Fonoster
 */
const defaultOptions: DefaultOptions = {
  queries: {
    cacheTime: DEFAULT_TIME,
    staleTime: DEFAULT_TIME,
    retry: 1,
    refetchOnWindowFocus: false,
    notifyOnChangeProps: ['data', 'error'],
  },
}

export const getQueryClient = () => new QueryClient({ defaultOptions })
