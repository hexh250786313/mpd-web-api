import mpdApi from 'mpd-api'
import type { Mpd } from './types'
import { wrapped } from './utils'

type AnyClient = any

const mpd: Mpd = {
  async register({ router, subscribe, send }) {
    // const client = await mpdApi.connect({ host: 'mpd', port: 6600 })
    const client = await mpdApi.connect({ host: '127.0.0.1', port: 6600 })
    // const client = await mpdApi.connect({ host: 'localhost', port: 6600 })

    const unsubscribe = subscribe((data) => {
      console.debug('TODO', 'mpd subscription', data)
    })
    const statusInterval = setInterval(async () => {
      const data = await client.api.status.get()
      send('status', data)
    })
    const names = Object.keys(client.api).flatMap((ns) => {
      return Object.keys((client.api as AnyClient)[ns]).map((name) => [
        ns,
        name,
      ])
    })
    names.forEach(([ns, name]) => {
      const route = `/${ns}/${name}`

      router.post(
        route,
        wrapped(async ({ req, res }) => {
          const args = req.body || []
          const fn = (client.api as AnyClient)[ns][name]
          const result = await fn(...args)
          res.json(result)
        })
      )
    })

    return async () => {
      clearInterval(statusInterval)
      unsubscribe()
      await client.api.connection.close()
    }
  },
}

export default mpd
