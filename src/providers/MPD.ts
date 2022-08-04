import type { MPDApi } from 'mpd-api'
import type { ValueType } from '../types'

import Locals from './Locals'
import mpdApi from 'mpd-api'
import Log from '../middlewares/Log'
import { Router } from 'express'
import NativeController from '../controllers/Api/Native'
import WS from '../middlewares/WS'
import { extractHostAndPort } from '../utils/extract-host-and-port'
import { formatSong } from '../utils'

export type IMPDNativeRoute = ValueType<{
    [t in keyof MPDApi.APIS]: [t, keyof MPDApi.APIS[t]]
}>

class MPD {
    public client: MPDApi.ClientAPI | null = null
    private waiting = false
    host: string
    port: number

    public setHost(_host: string) {
        this.host = _host
    }

    public setPort(_port: number) {
        this.port = _port
    }

    constructor() {
        const mpdUrl = Locals.config().mpdUrl
        const { host, port } = extractHostAndPort(mpdUrl)
        this.host = host
        this.port = port!
    }

    private getNames<T extends keyof MPDApi.APIS>(): IMPDNativeRoute[] {
        if (this.client) {
            const names = (Object.keys(this.client!.api) as Array<T>).flatMap(
                (ns) => {
                    return (
                        Object.keys(this.client!.api[ns]) as Array<
                            keyof MPDApi.APIS[T]
                        >
                    ).map((name) => [ns, name] as IMPDNativeRoute)
                }
            )

            return names
        }
        return []
    }

    private async connect() {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const that = this
        let count = 0
        const timeout = 1
        return new Promise((resolve) => {
            console.log(
                '\x1b[33m%s\x1b[0m',
                `MPD :: Connecting to MPD @ '${this.host}:${this.port}'`
            )
            ;(function attempt() {
                // if (count === 30) {
                // resolve(null)
                // }
                setTimeout(
                    () => {
                        mpdApi
                            .connect({
                                host: that.host,
                                port: that.port,
                                timeout: timeout * 1000,
                            })
                            .then((client) => {
                                const str = 'MPD :: Connected'
                                that.client = client
                                console.log('\x1b[33m%s\x1b[0m', str)
                                Log.info(str)
                                resolve(null)
                            })
                            .catch((e) => {
                                const str =
                                    'MPD :: ' +
                                    e +
                                    `. Retrying in ${timeout} second`
                                count++
                                    ? console.log('\x1b[31m%s\x1b[0m', str)
                                    : Log.error(str)
                                attempt()
                            })
                    },
                    count ? 1000 : 0
                )
            })()
        })
    }

    public getNativeRouter() {
        const names = this.getNames()
        const router = Router()

        names.forEach(([ns, name]) => {
            const route = `/${ns}/${name}`
            router.post(
                route,
                NativeController.validate(),
                NativeController.perform
            )
        })

        return router
    }

    public async listen() {
        if (WS.sendMessage) {
            this.client?.on('system', async (which) => {
                let data: any
                switch (which) {
                    case 'mixer':
                    case 'player': {
                        if (!this.waiting) {
                            this.waiting = true
                            data = await this.client?.api.playback.getvol()
                            setTimeout(() => {
                                this.waiting = false
                            }, 50)
                        } else {
                            which = ''
                        }
                        break
                    }
                    case 'playlist': {
                        data = await this.client?.api.queue.info()
                        if (data) {
                            data = formatSong(data)
                        }
                        break
                    }
                    default:
                }
                if (which) {
                    WS.sendMessage!('mpd')(which, data)
                }
            })
        }
        this.client?.on('close', async () => {
            this.client = null
            WS.sendMessage!('mpd')('close', {
                disconnected: true,
                port: this.port,
                host: this.host,
            })
            await this.connect()
            this.listen()
        })
    }

    public async init() {
        await this.connect()
        this.listen()
    }
}

export default new MPD()
