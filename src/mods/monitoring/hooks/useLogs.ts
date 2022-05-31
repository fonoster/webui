import type { SearchEventsResponse } from '@fonoster/monitor/dist/client/types'
import { useQuery } from 'react-query'

import { API } from '@/mods/shared/libs/api'

export const useLogs = (
  params: { time: string; eventType: string },
  queryKey = 'logs'
) => {
  const { data, isLoading, isSuccess } = useQuery<SearchEventsResponse>(
    [queryKey, params],
    async () =>
      (
        await API.get('/monitor', {
          params,
        })
      ).data.data
  )

  return {
    events: data?.events ?? [],
    isLoading,
    isSuccess,
  }
}
