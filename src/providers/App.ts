import { resolve } from 'node:path'
import Log from '../middlewares/Log'
import * as dotenv from 'dotenv'
import Express from './Express'
import { existsSync } from 'node:fs'
import MPD from './MPD'

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

    public async loadMPDClient(): Promise<void> {
        Log.info('MPD :: Connecting ...')

        await MPD.init()
        Express.mountNativeRoutes()
    }
}

export default new App()
