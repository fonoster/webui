import Fonoster from '@fonoster/sdk'
import { NextApiRequest, NextApiResponse } from 'next'

import { getUserLogged } from '@/mods/auth/lib/getUserLogged'
import { requestHandler } from '@/mods/shared/libs/api'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const manager = new Fonoster.Auth()
  const userManager = new Fonoster.Users(await getUserLogged(req))

  const handlers = {
    get: async () => userManager.getUser(req.query.ref as string),
    put: async () => userManager.updateUser(req.body),
    patch: async () =>
      manager.createToken({
        accessKeyId: (await getUserLogged(req)).accessKeyId,
      }),
  }

  return requestHandler({ handlers, req, res })
}
