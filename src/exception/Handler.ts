import type { NextFunction, Request, Response } from 'express'
import type { Application as WSApplication } from 'express-ws'

import Log from '../middlewares/Log'
import MPD from '../providers/MPD'

function addErrorHandlers(
    _express: WSApplication,
    handlerName: string,
    handler: any
): WSApplication {
    const stack: any[] = _express._router.stack
    const handlerIndex = stack.findIndex((t: any) => t.name === handlerName)
    if (handlerIndex === -1) {
        _express.use(handler)
    } else {
        ;[stack[handlerIndex], stack[stack.length - 1]] = [
            stack[stack.length - 1],
            stack[handlerIndex],
        ]
    }
    return _express
}

class Handler {
    public static addErrorHandlers(_express: WSApplication): any {
        Log.info('Routes :: Adding Error Handlers...')

        _express.addListener('addRoutes', () => {
            setTimeout(() => {
                addErrorHandlers(_express, 'errorHandler', this.errorHandler)
                addErrorHandlers(_express, 'logErrors', this.logErrors)
                // console.log(_express._router.stack)
            }, 50)
        })
        return _express
    }

    private static errorHandler(
        err: any,
        _req: Request,
        res: Response,
        next: NextFunction
    ): any {
        res.status(500).json({
            code: err.status || 500,
            message: 'Failed: ' + err,
            data: null,
        })
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

    public static noMPDConnectionHandler(_express: WSApplication): any {
        _express.use(
            /^(?!(\/mpd\/client\/url$)).*/,
            (req: Request, res: Response, next: NextFunction) => {
                if (!MPD.client) {
                    const message = 'Failed: MPD client is not connected!'
                    const ip =
                        req.headers['x-forwarded-for'] ||
                        req.socket.remoteAddress
                    Log.error(`${message} [IP: '${ip}']!`)
                    return res.status(500).json({
                        code: 500,
                        message,
                        data: {
                            disconnected: true,
                            port: MPD.port,
                            host: MPD.host,
                        },
                    })
                }

                return next()
            }
        )

        return _express
    }

    // public static errorHandler(
    // err: any,
    // req: Request,
    // res: Response,
    // next: NextFunction
    // ): any {
    // Log.error(err.stack)

    // const apiPrefix = Locals.config().apiPrefix
    // if (req.originalUrl.includes(`/${apiPrefix}/`)) {
    // if (err.name && err.name === 'UnauthorizedError') {
    // const innerMessage =
    // err.inner && err.inner.message
    // ? err.inner.message
    // : undefined
    // res.json({
    // error: ['Invalid Token!', innerMessage],
    // })
    // } else {
    // res.json({
    // error: err,
    // })
    // }
    // return res.status(500)
    // }

    // return next(err)
    // }
}

export default Handler
