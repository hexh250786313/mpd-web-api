import { resolve } from 'node:path'
import Log from '../middlewares/Log'
import * as dotenv from 'dotenv'
import Express from './Express'
import { existsSync } from 'node:fs'
import Mpd from './Mpd'

class App {
    public loadConfiguration(): void {
        Log.info('Configuration :: Booting ...')

        if (existsSync(resolve('.env'))) {
            dotenv.config({
                path: resolve('.env'),
            })
        }
    }

    public loadServer(): void {
        Log.info('Server :: Booting ...')

        Express.init()
    }

    public async loadMpdClient(): Promise<void> {
        Log.info('Mpd :: Connecting ...')

        await Mpd.init()
        Express.mountNativeRoutes()
    }

    public loadServerErrorHandler(): void {
        // @fixme:
        // Express.mountNoMpdConnectionHandler()
        // Express.mountErrorHandler()
    }
}

export default new App()
