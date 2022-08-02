import type { NextFunction, Request, Response } from 'express'
import Locals from '../../../providers/Locals'
import MPD from '../../../providers/MPD'

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
            MPD.setPort(port)
            res.status(200).json({
                code: 200,
                message: `MPD client is now listening on port ${port}`,
                data: null,
            })
        } else {
            res.status(500).json({
                code: 500,
                message: 'Failed to connect to MPD',
                data: {
                    disconnected: true,
                    host: MPD.host,
                    port: MPD.port,
                },
            })
        }
    }
}
