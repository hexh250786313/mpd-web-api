import type { MPDApi } from 'mpd-api'

import Locals from './Locals'
import mpdApi from 'mpd-api'
import Log from '../middlewares/Log'
import { Router } from 'express'
import NativeController from '../controllers/Api/Native'
import { ValueType } from '../types'

export type IMpdNativeRoute = ValueType<{
    [t in keyof MPDApi.APIS]: [t, keyof MPDApi.APIS[t]]
}>

class Mpd {
    public client: MPDApi.ClientAPI | null = null
    host: string
    port: number

    constructor(params?: { host: string; port: number }) {
        this.host =
            params?.host ??
            Locals.config().mpdUrl.replace(/(^https?:\/\/|:\d*$)/g, '')
        this.port =
            params?.port ??
            parseInt(Locals.config().mpdUrl.replace(/(^.*:)/g, ''))
    }

    private getNames<T extends keyof MPDApi.APIS>(): IMpdNativeRoute[] {
        if (this.client) {
            const names = (Object.keys(this.client!.api) as Array<T>).flatMap(
                (ns) => {
                    return (
                        Object.keys(this.client!.api[ns]) as Array<
                            keyof MPDApi.APIS[T]
                        >
                    ).map((name) => [ns, name] as IMpdNativeRoute)
                }
            )

            return names
        }
        return []
    }

    private async connect() {
        try {
            this.client = await mpdApi.connect({
                host: this.host,
                port: this.port,
            })
            Log.info('Mpd :: Connected')
        } catch (e) {
            Log.error('Mpd :: ' + e)
        }
    }

    public getNativeRouter() {
        const names = this.getNames()
        const router = Router()

        names.forEach(([ns, name]) => {
            const route = `/${ns}/${name}`
            router.post(route, NativeController.perform)
        })

        return router
    }

    public async init() {
        await this.connect()
    }
}

export default new Mpd()
