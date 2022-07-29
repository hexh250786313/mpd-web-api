import type { Application } from 'express'

import express from 'express'
import Locals from './Locals'
import Routes from './Routes'
import Bootstrap from '../middlewares/Kernel'
import ExceptionHandler from '../exception/Handler'

class Express {
    public express: Application
    constructor() {
        this.express = express()

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

    public mountNativeRoutes(): void {
        this.express = Routes.mountNativeApi(this.express)

        this.express.use(ExceptionHandler.logErrors)
        this.express.use(ExceptionHandler.clientErrorHandler)
    }

    public init(): any {
        const port: number = Locals.config().port

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
