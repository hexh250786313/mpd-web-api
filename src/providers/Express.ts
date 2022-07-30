import type { Application as WSApplication } from 'express-ws'

import express from 'express'
import Locals from './Locals'
import Routes from './Routes'
import Bootstrap from '../middlewares/Kernel'
import ExceptionHandler from '../exception/Handler'
import WebSocket from './WebSocket'

class Express {
    public express: WSApplication
    constructor() {
        this.express = express() as unknown as WSApplication

        this.mountDotEnv()
        this.mountMiddlewares()
        this.mountRoutes()
    }

    private mountDotEnv(): void {
        this.express = Locals.init(this.express)
    }

    private mountMiddlewares(): void {
        this.express = Bootstrap.init(this.express)
    }

    private mountRoutes(): void {
        this.express = Routes.mountApi(this.express)
    }

    public mountNotFoundHandler(): void {
        this.express = ExceptionHandler.notFoundHandler(this.express) // it must register after all routes are mounted
    }

    public mountErrorHandler(): void {
        this.express.use(ExceptionHandler.logErrors)
        this.express.use(ExceptionHandler.clientErrorHandler)
    }

    public mountNativeRoutes(): void {
        this.express = Routes.mountNativeApi(this.express)
    }

    public mountWebSocket(): void {
        this.express = WebSocket.enableWebSocket(this.express)
    }

    public init(): any {
        const port: number = Locals.config().port

        this.mountWebSocket()

        this.express
            .listen(port, () => {
                return console.log(
                    '\x1b[33m%s\x1b[0m',
                    `Server :: Running @ 'http://localhost:${port}'`
                )
            })
            .on('error', (_error) => {
                return console.log('Error: ', _error.message)
            })
    }
}

export default new Express()
