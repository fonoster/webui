import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import React, { useLayoutEffect, useState } from 'react'
import { dehydrate } from 'react-query'

import type { AppPage } from '@/@types'
import { TIMES } from '@/mods/shared/constants/filters'
import { useTitle } from '@/mods/shared/hooks/useTitle'
import { getQueryClient } from '@/mods/shared/libs/queryClient'
import { Badge, Spinner, Text, Title } from '@/ui'

import { LogsHeader } from '../components/LogsHeader'
import { NoLogs } from '../components/NoLogs'
import { useLogs } from '../hooks/useLogs'
import { getStatus } from '../lib/logsUtilities'

export const CallLogsBoard: AppPage = () => {
  const [timestamp, setTimestamp] = useState(TIMES[0])
  const { events, isSuccess } = useLogs({
    time: timestamp.value,
    eventType: 'call',
  })
  const { setTitle } = useTitle()

  useLayoutEffect(() => {
    setTitle('Monitoring')
  }, [setTitle])

  return (
    <>
      <div className="mb-4 lg:w-4/6">
        <Title level={3}>Call logs</Title>
        <Text className="whitespace-normal">
          Here you will find your call records.{' '}
          <a
            className="term"
            href="https://learn.fonoster.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more.
          </a>
        </Text>
      </div>
      <LogsHeader onChange={data => setTimestamp(data)} total={events.length} />
      {isSuccess ? (
        <>
          {!events.length ? (
            <NoLogs />
          ) : (
            <table className="table-auto border-collapse rounded">
              <thead className="bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-6 text-left text-xs font-medium text-white tracking-wider"
                  >
                    REF
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-6 text-left text-xs font-medium text-white tracking-wider"
                  >
                    TIME
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-6 text-left text-xs font-medium text-white tracking-wider"
                  >
                    MESSAGE
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-6 text-left text-xs font-medium text-white tracking-wider"
                  >
                    STATUS
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-6 text-left text-xs font-medium text-white tracking-wider"
                  >
                    DIRECTION
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-6 text-left text-xs font-medium text-white tracking-wider"
                  >
                    FROM
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-6 text-left text-xs font-medium text-white tracking-wider"
                  >
                    TO
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-6 text-left text-xs font-medium text-white tracking-wider"
                  >
                    CALL TYPE
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-6 text-left text-xs font-medium text-white tracking-wider"
                  >
                    DURATION
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, idx) => (
                  <tr
                    key={event.ref}
                    className={idx % 2 === 0 ? 'bg-gray-600' : 'bg-gray-700'}
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white truncate max-w-[132px]">
                      {event.ref}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 truncate min-w-[260px]">
                      {new Date(event.timestamp).toUTCString()}
                    </td>
                    <td className="px-6 py-4 whitespace-normal text-gray-300 truncate max-w-[360px] min-w-[320px]">
                      {event.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 capitalize truncate">
                      <Badge
                        dot
                        color={getStatus(event?.body?.status).color as any}
                      >
                        {getStatus(event?.body?.status).message}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 capitalize truncate">
                      {`${event.body.direction ?? 'Unknown'}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 truncate">
                      {`${event.body.from ?? 'Unknown'}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 truncate">
                      {`${event.body.to ?? 'Unknown'}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 truncate">
                      {`${event.body.callType ?? 'Unknown'}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 capitalize truncate">
                      {`${event.body.duration ?? 'Unknown'}`}
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

CallLogsBoard.isProtected = true

export default CallLogsBoard
