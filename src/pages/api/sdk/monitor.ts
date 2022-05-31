import Monitor from '@fonoster/monitor'
import { NextApiRequest, NextApiResponse } from 'next'

import { getServerCurrentProject } from '@/mods/auth/lib/getUserLogged'
import { TIMES, validateTimeFilter } from '@/mods/shared/constants/filters'
import { requestHandler } from '@/mods/shared/libs/api'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const manager = new Monitor(getServerCurrentProject(req))

  const get = async () => {
    const { time = TIMES[0].value, eventType = 'app' } = req.query

    validateTimeFilter(time as string)

    if (!['app', 'sip', 'call'].includes(eventType as string))
      throw new Error('The event-type parameter is not valid')

    return manager.searchEvents({
      query: {
        bool: {
          must: {
            match: {
              eventType,
            },
          },
          filter: {
            range: {
              '@timestamp': {
                gte: time,
              },
            },
          },
        },
      },
    })
  }

  return requestHandler({ handlers: { get }, req, res })
}
