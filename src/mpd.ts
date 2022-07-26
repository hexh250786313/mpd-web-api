import type { RawData } from 'ws'
import type { Mpd } from './types'

import mpdApi from 'mpd-api'
import { wrapped } from './utils'
import { routesHandler } from './routes'

type AnyClient = any

function getMessage(message?: string | RawData) {
  let data: any
  try {
    data = JSON.parse(JSON.parse(message!.toString()))
  } catch (e) {
    data = undefined
  }
  return data
}

const mpd: Mpd = {
  async register({ app, router, subscribe, send }) {
    const client = await mpdApi.connect({ host: '127.0.0.1', port: 6600 })

    let statusInterval = null as NodeJS.Timer | null

    const unsubscribe = subscribe((message) => {
      message = getMessage(message)
      if (message?.channel === 'mpd' && message?.packet) {
        const { packet, data } = message
        console.log({ packet, data })
        if (packet === 'status') {
          // do something
        }
      }
    })

    app.ws('/status', (ws) => {
      ws.on('message', (msg) => {
        const message = getMessage(msg)
        if (message && message?.channel === 'mpd' && message?.packet) {
          switch (message.packet) {
            case 'report': {
              if (statusInterval) {
                clearInterval(statusInterval)
              }
              statusInterval = setInterval(() => {
                client.api.status.get().then((data) => {
                  send('status', data)
                })
              }, 1000)
              break
            }
            case 'deport': {
              if (statusInterval) {
                clearInterval(statusInterval)
              }
              break
            }
            default: {
              break
            }
          }
        }
      })
      ws.on('close', () => {
        if (statusInterval) {
          clearInterval(statusInterval)
        }
      })
    })

    const names = Object.keys(client.api).flatMap((ns) => {
      return Object.keys((client.api as AnyClient)[ns]).map((name) => [
        ns,
        name,
      ])
    })
    names.push(['db', 'about'])
    names.forEach(([ns, name]) => {
      const route = `/${ns}/${name}`

      router.post(route, wrapped(routesHandler(client, route)))
    })

    return async () => {
      if (statusInterval) {
        clearInterval(statusInterval)
      }
      unsubscribe()
      await client.api.connection.close()
    }
  },
}

export default mpd
