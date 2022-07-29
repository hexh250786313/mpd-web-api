import type { Application } from 'express'

import express from 'express'
import Log from './Log'

class Http {
    public static mount(_express: Application): Application {
        Log.info("Booting the 'HTTP' middleware...")

        // use before mounting routes, otherwise req.body is undefined
        _express.use(express.json())
        _express.use(express.urlencoded({ extended: true }))

        _express.disable('x-powered-by')

        return _express
    }
}

export default Http
