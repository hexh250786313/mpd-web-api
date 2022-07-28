import { resolve } from 'node:path'
import Log from '../middlewares/Log'
import * as dotenv from 'dotenv'
import Express from './Express'
import { existsSync } from 'node:fs'

class App {
    public loadConfiguration(): void {
        Log.info('Configuration :: Booting @ Master...')

        if (existsSync(resolve('.env'))) {
            dotenv.config({
                path: resolve('.env'),
            })
        }
    }

    public loadServer(): void {
        Log.info('Server :: Booting @ Master...')

        Express.init()
    }
}

export default new App()
