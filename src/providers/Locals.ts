import type { Application as WSApplication } from 'express-ws'

import { resolve } from 'node:path'
import * as dotenv from 'dotenv'
import { existsSync } from 'node:fs'

class Locals {
    public static config(): any {
        if (existsSync(resolve('.env'))) {
            dotenv.config({
                path: resolve('.env'),
            })
        }

        const url =
            process.env.APP_URL || `http://localhost:${process.env.PORT}`
        const port = process.env.PORT || 8080
        const year = new Date().getFullYear()
        const isCORSEnabled = process.env.CORS_ENABLED || true
        const apiPrefix = process.env.API_PREFIX || 'mpd'
        const nativeApiPrefix = process.env.NATIVE_API_PREFIX || 'native'
        const webApiPrefix = process.env.WEB_API_PREFIX || 'web'
        const logDays = process.env.LOG_DAYS || 10
        const mpdUrl = process.env.MPD_URL || `http://localhost:6600`

        return {
            apiPrefix,
            nativeApiPrefix,
            webApiPrefix,
            isCORSEnabled,
            port,
            url,
            year,
            logDays,
            mpdUrl,
        }
    }

    public static init(_express: WSApplication): WSApplication {
        _express.locals.app = this.config()
        return _express
    }
}

export default Locals
