import type { NextFunction, Request, Response } from 'express'
import Locals from '../../../providers/Locals'
import Mpd from '../../../providers/Mpd'

export class UrlController {
    public static perform(
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        const port = 6600
        const host = 'http://localhost'
        const serverUrl = Locals.config().url
        console.log({ serverUrl, port })
        if (serverUrl !== `${host}:${port}`) {
            console.log('------------')
            Mpd.setPort(port)
            // console.log('Url go')
            // console.log(req.body)
            // console.log(req.get('Content-Type'))
        }
        res.status(500).json({
            code: 500,
            message: 'Failed to connect to MPD',
            data: {
                disconnected: true,
                host: Mpd.host,
                port: Mpd.port,
            },
        })
    }
}
