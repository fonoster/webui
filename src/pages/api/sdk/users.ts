import Fonoster from '@fonoster/sdk'
import { NextApiRequest, NextApiResponse } from 'next'

import { getUserLogged } from '@/mods/auth/lib/getUserLogged'
import { requestHandler } from '@/mods/shared/libs/api'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const manager = new Fonoster.Auth()

  const handlers = {
    patch: async () =>
      manager.createToken({
        accessKeyId: (await getUserLogged(req)).accessKeyId,
      }),
  }

  return requestHandler({ handlers, req, res })
}
