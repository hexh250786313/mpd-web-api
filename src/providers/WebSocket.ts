import type { Application as WSApplication } from 'express-ws'
import type { RawData } from 'ws'

function getMessage(message?: string | RawData) {
    let data: any
    try {
        data = JSON.parse(JSON.parse(message!.toString()))
    } catch (e) {
        data = undefined
    }
    return data
}

class WebSocket {
    public static enableWebSocket(_express: WSApplication): WSApplication {
        _express.ws(`/`, (ws) => {
            ws.on('message', (msg) => {
                msg = getMessage(msg)
                console.log(msg)
            })
            ws.on('close', () => {
                // TODO:
            })
        })

        return _express
    }
}

export default WebSocket
