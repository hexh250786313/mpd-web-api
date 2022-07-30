import type { Application as WSApplication } from 'express-ws'
import type { WebSocketPacketData } from '../types'

import enableWS from 'express-ws'
import Log from './Log'

export type SendMessageFunction = (
    channel: string
) => (packet: string, data: WebSocketPacketData) => void

class WS {
    sendMessage: SendMessageFunction | null = null

    public mount(_express: WSApplication): WSApplication {
        Log.info("Booting the 'WS' middleware...")

        enableWS(_express)
        const ews = enableWS(_express)
        const wss = ews.getWss()

        const broadcast = (data: string) =>
            Array.from(wss.clients)
                .filter((client: any) => client.readyState === 1)
                .forEach((client: any) => client.send(data))

        this.sendMessage =
            (channel: string) => (packet: string, data: WebSocketPacketData) =>
                broadcast(
                    JSON.stringify({
                        channel,
                        packet,
                        data,
                    })
                )

        return _express
    }
}

export default new WS()
