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
        _express.ws(`/`, (ws, _req, next) => {
            ws.on('message', (msg) => {
                try {
                    msg = getMessage(msg)
                    console.log(msg)
                } catch (e) {
                    next(e)
                }
            })
            ws.on('close', () => {
                try {
                    // @todo:
                } catch (e) {
                    next(e)
                }
            })
            ws.on('error', (e) => {
                next(e)
            })
        })

        return _express
    }
}

export default WebSocket
