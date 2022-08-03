import type { Application as WSApplication } from 'express-ws'

import Log from '../middlewares/Log'
import apiRouter from './../routes/Api'
import Locals from './Locals'
import MPD from './MPD'

class Routes {
    public static mountApi(_express: WSApplication): WSApplication {
        const apiPrefix = Locals.config().apiPrefix
        Log.info('Routes :: Mounting API Routes...')

        _express.use(`/${apiPrefix}`, apiRouter)
        _express.emit('addRoutes')

        return _express
    }

    public static mountNativeApi(_express: WSApplication): WSApplication {
        const apiPrefix = Locals.config().apiPrefix
        const nativeApiPrefix = Locals.config().nativeApiPrefix
        Log.info('Routes :: Mounting Native API Routes...')
        const nativeRouter = MPD.getNativeRouter()

        _express.use(`/${apiPrefix}/${nativeApiPrefix}`, nativeRouter)
        _express.emit('addRoutes')

        return _express
    }
}

export default Routes
