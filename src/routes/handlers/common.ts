import type { MPDApi } from 'mpd-api'
import type { AnyClient } from '../../types'
import type { WrappedFunction } from '../../utils/wrapped'

export const commonHandler: (
  client: MPDApi.ClientAPI,
  route: string
) => WrappedFunction = (client, route) => {
  const [ns, name] = route.replace(/^\//, '').split('/')

  return async ({ req, res }) => {
    const args = Array.isArray(req?.body?.fnArgs) ? req.body.fnArgs : []
    const fn = (client.api as AnyClient)[ns][name]
    const result = await fn(...args)
    res.json({
      code: 200,
      message: 'OK',
      data: result,
    })
  }
}
