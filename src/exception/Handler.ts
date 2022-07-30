import type { NextFunction, Request, Response } from 'express'
import type { Application as WSApplication } from 'express-ws'

import Log from '../middlewares/Log'
import Locals from '../providers/Locals'

class Handler {
    public static notFoundHandler(_express: WSApplication): any {
        const apiPrefix = Locals.config().apiPrefix

        _express.use('*', (req: Request, res: Response) => {
            const ip =
                req.headers['x-forwarded-for'] || req.socket.remoteAddress

            Log.error(`Path '${req.originalUrl}' not found [IP: '${ip}']!`)
            if (req.xhr || req.originalUrl.includes(`/${apiPrefix}/`)) {
                return res.json({
                    error: 'Page Not Found',
                })
            } else {
                res.status(404)
                return res.render('pages/error', {
                    title: 'Page Not Found',
                    error: [],
                })
            }
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

        if (req.xhr) {
            return res.status(500).send({ error: err.stack })
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
        res.status(500)

        const apiPrefix = Locals.config().apiPrefix
        if (req.originalUrl.includes(`/${apiPrefix}/`)) {
            if (err.name && err.name === 'UnauthorizedError') {
                const innerMessage =
                    err.inner && err.inner.message
                        ? err.inner.message
                        : undefined
                return res.json({
                    error: ['Invalid Token!', innerMessage],
                })
            }

            return res.json({
                error: err,
            })
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
}

export default Handler
