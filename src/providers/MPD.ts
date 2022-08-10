import type { MPDApi } from 'mpd-api'
import type { ValueType } from '../types'

import Locals from './Locals'
import mpdApi from 'mpd-api'
import Log from '../middlewares/Log'
import { Router } from 'express'
import NativeController from '../controllers/Api/Native'
import WS from '../middlewares/WS'
import { extractHostAndPort } from '../utils/extract-host-and-port'
import {
    debouncePromise,
    formatSong,
    getStoredPlaylist,
    throttlePromise,
} from '../utils'
import { isEqual } from 'lodash-es'

export type IMPDNativeRoute = ValueType<{
    [t in keyof MPDApi.APIS]: [t, keyof MPDApi.APIS[t]]
}>

class MPD {
    public client: MPDApi.ClientAPI | null = null
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
        let cache: any
        if (WS.sendMessage) {
            // Combining throttle and debounce, so that we can throttle the "player" / "mixer" changing and also run the last call
            // note that throtte delay can not be too long cause it will make the debounce can not get the right last run
            /**
             * For the condition that mixer and player are changed at the same time ( play or pause, we just need "player" in this case )
             * 50ms is enough to prevent the conflict
             *  */
            const throttleIt = throttlePromise(50)
            /** For invoking the last call */
            const doubleIt = debouncePromise(250)
            this.client?.on('system', async (which) => {
                let data: any = null
                switch (which) {
                    case 'playlist': {
                        data = await this.client?.api.queue.info()
                        if (data) {
                            data = formatSong(data)
                        }
                        break
                    }
                    case 'stored_playlist': {
                        data = await getStoredPlaylist()
                        break
                    }
                    default: {
                        await throttleIt(async () => {
                            await doubleIt(async () => {
                                data = await this.client?.api.status.get()
                                if (data?.bitrate) {
                                    data.bitrate = undefined
                                }
                            })
                        })
                        break
                    }
                }
                // @fixme: 00:00 -> 00:00 not sending
                if (!isEqual(data, cache)) {
                    console.log('----------------', which)
                    WS.sendMessage!('mpd')(which, data)
                    cache = data
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
