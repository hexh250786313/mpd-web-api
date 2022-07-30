import type { Application as WSApplication } from 'express-ws'

import CORS from './CORS'
import Http from './Http'
import WS from './WS'

class Kernel {
    public static init(_express: WSApplication): WSApplication {
        _express = WS.mount(_express)
        _express = Http.mount(_express)
        _express = CORS.mount(_express)

        return _express
    }
}

export default Kernel
