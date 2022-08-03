import type { NextFunction, Request, Response } from 'express'
import { body } from 'express-validator'
import MPD from '../../../providers/MPD'
import { validated } from '../../../utils'
import { extractHostAndPort } from '../../../utils/extract-host-and-port'

export class ConnectController {
    public static perform(
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        validated({ req, res, next }, () => {
            const { port, host } = extractHostAndPort(req.body.url)
            if (MPD.client || !host || !port) {
                res.status(400).json({
                    code: 400,
                    message: 'MPD is already connected',
                    data: {
                        disconnected: false,
                        host: MPD.host,
                        port: MPD.port,
                    },
                })
            } else {
                MPD.setPort(port)
                MPD.setHost(host)
                res.status(200).json({
                    code: 200,
                    message: `MPD client is now listening on port ${port}`,
                    data: null,
                })
            }
        })
    }

    public static validate(): any {
        return [
            body('url')
                .isString()
                .withMessage('url is required and must be a string'),
        ]
    }
}
