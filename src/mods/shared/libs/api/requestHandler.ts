import { NextApiRequest, NextApiResponse } from 'next'

import type { IRequestHandler } from '@/@types'

import { Response, ResponseCodes } from './Response'

const parseMethod = (method: string) => method?.toLowerCase()

export const defaultPagination = { pageSize: 24, pageToken: '1', view: 2 }

/**
 * @summary Calls the route action and handles throws
 *
 * @author Fonoster
 */
export const requestHandler = async ({
  handlers,
  req,
  res,
}: {
  handlers: IRequestHandler
  req: NextApiRequest
  res: NextApiResponse
}) => {
  try {
    const handler = handlers[parseMethod(req.method as string)]

    if (!handler)
      throw new Error(
        `The HTTP '${req.method}' method is not supported at this route.`
      )

    const response = Response.ok(await handler())

    res.status(response?.status ?? ResponseCodes.OK).json(response)
  } catch (e) {
    const error = Response.error((e as Error)?.message)

    res.status(error.status).json(error)
  }
}
