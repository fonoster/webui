import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import { useLayoutEffect, useState } from 'react'
import { dehydrate } from 'react-query'

import type { AppPage } from '@/@types'
import { TIMES } from '@/mods/shared/constants/filters'
import { useTitle } from '@/mods/shared/hooks/useTitle'
import { getQueryClient } from '@/mods/shared/libs/queryClient'
import { Badge, Spinner } from '@/ui'
import { Json } from '@/ui/JsonViewer'

import { LogsHeader } from '../components/LogsHeader'
import { NoLogs } from '../components/NoLogs'
import { useLogs } from '../hooks/useLogs'
import { getLevel } from '../lib/logsUtilities'

export const AppLogsBoard: AppPage = () => {
  const [timestamp, setTimestamp] = useState(TIMES[0])
  const { events, isSuccess } = useLogs({
    time: timestamp.value,
    eventType: 'app',
  })
  const { setTitle } = useTitle()

  useLayoutEffect(() => {
    setTitle('Monitoring / App Logs')
  }, [setTitle])

  return (
    <>
      <LogsHeader onChange={data => setTimestamp(data)} total={events.length} />
      {isSuccess ? (
        <>
          {!events.length ? (
            <NoLogs />
          ) : (
            <table className="table-auto border-collapse border border-gray-500 divide-y divide-gray-400 rounded">
              <thead className="bg-gray-600">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
                  >
                    Severity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
                  >
                    Ref
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
                  >
                    Time
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
                  >
                    Message
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-white tracking-wider"
                  >
                    Data
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, idx) => (
                  <tr
                    key={event.ref}
                    className={idx % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize truncate">
                      <Badge dot color={getLevel(event.level).color as any}>
                        {getLevel(event.level).message}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white truncate max-w-[132px]">
                      {event.ref}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 truncate">
                      {new Date(event.timestamp).toUTCString()}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-300 truncate max-w-[360px] min-w-[320px]">
                      {event.message}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-gray-300 truncate max-w-[560px] min-w-[400px]">
                      <Json
                        data={event.body}
                        bg={idx % 2 === 0 ? '#27292f' : '#2b2e35'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : (
        <Spinner />
      )}
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req })
  const queryClient = getQueryClient()

  /**
   * @todo Find a way to hydrate queries on server without using fetch or axios
   * await queryClient.prefetchQuery('projects', getProjects)
   */

  return {
    props: {
      session,
      dehydratedState: dehydrate(queryClient),
    },
  }
}

AppLogsBoard.isProtected = true

export default AppLogsBoard
