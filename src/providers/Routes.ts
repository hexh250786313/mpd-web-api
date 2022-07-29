import type { Application } from 'express'

import Log from '../middlewares/Log'
import apiRouter from './../routes/Api'
import Locals from './Locals'
import Mpd from './Mpd'

class Routes {
    public mountApi(_express: Application): Application {
        const apiPrefix = Locals.config().apiPrefix
        const webApiPrefix = Locals.config().webApiPrefix
        Log.info('Routes :: Mounting API Routes...')

        return _express.use(`/${apiPrefix}/${webApiPrefix}`, apiRouter)
    }

    public mountNativeApi(_express: Application): Application {
        const apiPrefix = Locals.config().apiPrefix
        const nativeApiPrefix = Locals.config().nativeApiPrefix
        Log.info('Routes :: Mounting Native API Routes...')
        const nativeRouter = Mpd.getNativeRouter()

        return _express.use(`/${apiPrefix}/${nativeApiPrefix}`, nativeRouter)
    }
}

export default new Routes()
