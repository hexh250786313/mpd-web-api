import type { MPDApi } from 'mpd-api'

import { dbAboutHandler } from './handlers/db'

export function routesHandler(client: MPDApi.ClientAPI, route: string) {
    switch (route) {
        case '/db/about': {
            return dbAboutHandler(client, route)
        }
        default:
    }
}
