import express from 'express'
import expressWs from 'express-ws'
import mpd from './mpd'
import type { Request, Response, NextFunction } from 'express'
import type { Application } from 'express-ws'
import type { Configuration, MpdSubscriber, WebSocketPacketData } from './types'

/**
 * Exception abstraction for Express routes.
 */
export class RequestError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

/**
 * Creates a new WebSocket server broadcaster.
 */
function createWebsocketServer(app: Application) {
  const ews = expressWs(app)
  const wss = ews.getWss()

  const broadcast = (data: string) =>
    Array.from(wss.clients)
      .filter((client: any) => client.readyState === 1)
      .forEach((client: any) => client.send(data))

  const sendMessage =
    (channel: string) => (packet: string, data: WebSocketPacketData) =>
      broadcast(
        JSON.stringify({
          channel,
          packet,
          data,
        })
      )

  return { sendMessage }
}

/**
 * Creates Express Application.
 */
export async function createApp(config: Configuration) {
  const app = express() as unknown as Application
  const { sendMessage } = createWebsocketServer(app)
  const send = sendMessage('mpd')

  let callback: MpdSubscriber

  app.use(express.json())

  const router = express.Router()

  const subscribe = (cb: MpdSubscriber) => {
    callback = cb
    return () => {
      console.log('mpd unsubscribed')
      process.exit(0)
    }
  }

  const shutdown = await mpd.register({
    app,
    router,
    config,
    send,
    subscribe,
  })

  app.use(router)

  app.ws('/', (ws) => {
    ws.on('message', (msg) => {
      const { channel, data } = JSON.parse(msg.toString())
      console.log(channel)
      callback(data)
    })
  })

  app.use((_, __, next) => {
    next(new RequestError(404, 'Not found'))
  })

  app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      next(err)
      return
    }

    const { message, stack, ...meta } = err

    res.status((err as RequestError).status || 500)

    res.json({
      message,
      stack,
      meta,
    })
  })

  process.on('SIGINT', async () => {
    try {
      await shutdown()
    } catch (e) {
      console.error('Error shutting down', e)
      process.exit(1)
    } finally {
      process.exit(0)
    }
  })

  const port = process.env.PORT || 8080

  app.listen(port, () => console.log('Listening on port', port))
}
