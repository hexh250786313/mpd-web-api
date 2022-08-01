import type { NextFunction, Request, Response } from 'express'
import type { Application as WSApplication } from 'express-ws'

import Log from '../middlewares/Log'
import Locals from '../providers/Locals'
import Mpd from '../providers/Mpd'

class Handler {
    public static notFoundHandler(_express: WSApplication): any {
        console.log('not found')

        _express.use('*', (req: Request, res: Response) => {
            const ip =
                req.headers['x-forwarded-for'] || req.socket.remoteAddress

            Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`)
            return res.status(404).send()
        })

        return _express
    }

    public static clientErrorHandler(
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        Log.error(err.stack)

        console.log('client error')
        if (req.xhr) {
            return res.status(500).json({ error: err.stack })
        } else {
            res.json({
                code: err.status || 500,
                message: 'Failed: ' + err,
            })
            return next(err)
        }
    }

    public static errorHandler(
        err: any,
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        Log.error(err.stack)

        console.log('error')
        const apiPrefix = Locals.config().apiPrefix
        if (req.originalUrl.includes(`/${apiPrefix}/`)) {
            if (err.name && err.name === 'UnauthorizedError') {
                const innerMessage =
                    err.inner && err.inner.message
                        ? err.inner.message
                        : undefined
                res.json({
                    error: ['Invalid Token!', innerMessage],
                })
            } else {
                res.json({
                    error: err,
                })
            }
            return res.status(500)
        }

        return next(err)
    }

    public static logErrors(
        err: any,
        _req: Request,
        _res: Response,
        next: NextFunction
    ): any {
        Log.error(err.stack)

        return next(err)
    }

    public static noMpdConnectionHandler(_express: WSApplication): any {
        console.log('mount')
        _express.use(
            /^(?!(\/mpd\/client\/url$)).*/,
            (req: Request, res: Response, next: NextFunction) => {
                if (!Mpd.client) {
                    const message = 'Failed: Mpd client is not connected!'
                    const ip =
                        req.headers['x-forwarded-for'] ||
                        req.socket.remoteAddress
                    Log.error(`${message} [IP: '${ip}']!`)
                    return res.status(500).json({
                        code: 500,
                        message,
                        data: {
                            disconnected: true,
                            port: Mpd.port,
                            host: Mpd.host,
                        },
                    })
                }

                return next()
            }
        )

        return _express
    }
}

export default Handler
