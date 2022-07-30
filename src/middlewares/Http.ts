import type { Application as WSApplication } from 'express-ws'

import express from 'express'
import Log from './Log'

class Http {
    public static mount(_express: WSApplication): WSApplication {
        Log.info("Booting the 'HTTP' middleware...")

        // use before mounting routes, otherwise req.body is undefined
        _express.use(express.json())
        _express.use(express.urlencoded({ extended: true }))

        _express.disable('x-powered-by')

        return _express
    }
}

export default Http
