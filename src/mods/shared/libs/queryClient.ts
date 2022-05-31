import { DefaultOptions, QueryClient } from 'react-query'

/**
 * React Query Options
 * @summary Set the config on all queries and mutations through the client.
 *
 * @author Fonoster
 */
const defaultOptions: DefaultOptions = {
  queries: {
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    notifyOnChangeProps: ['data', 'error'],
  },
}

export const getQueryClient = () => new QueryClient({ defaultOptions })
