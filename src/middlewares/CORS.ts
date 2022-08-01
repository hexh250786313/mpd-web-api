import type { Application as WSApplication } from 'express-ws'
import type { CorsOptions } from 'cors'

import cors from 'cors'

import Log from './Log'

class CORS {
    public mount(_express: WSApplication): WSApplication {
        Log.info("Booting the 'CORS' middleware...")

        // _express.use((req, res, next) => {
        // res.header('Access-Control-Allow-Credentials', 'true')
        // res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
        // res.header('Access-Control-Allow-Headers', 'Content-Type, Accept')
        // if (req.method == 'OPTIONS') {
        // res.sendStatus(200)
        // } else {
        // next()
        // }
        // })

        const options = {
            // origin: (a, callback) => {
            // callback(null, a)
            // },
            // credentials: true,
            optionsSuccessStatus: 200, // default: 204 No content
        } as CorsOptions

        _express.use(cors(options))

        return _express
    }
}

export default new CORS()
