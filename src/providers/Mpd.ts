import type { MPDApi } from 'mpd-api'

import Locals from './Locals'
import mpdApi from 'mpd-api'

type AnyClient = any

class Mpd {
    client: MPDApi.ClientAPI | null = null
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

    public async connect() {
        this.client = await mpdApi.connect({ host: this.host, port: this.port })
    }

    public names() {
        const names = Object.keys(this.client!.api).flatMap((ns) => {
            return Object.keys((this.client!.api as AnyClient)[ns]).map(
                (name) => [ns, name]
            )
        })
        console.log('---------', names)
    }
}

export default new Mpd()
