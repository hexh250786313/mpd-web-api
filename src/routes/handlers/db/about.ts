import type { MPDApi } from 'mpd-api'
import type { AnyClient } from '../../../types'
import type { WrappedFunction } from '../../../utils/wrapped'

// function handleArgs(args: any[]) {
// const [tag = '', filter = false, groups = []] = JSON.parse(
// JSON.stringify(args)
// )

// return args
// }

function getHandlers(args: any[]) {
    let [tag = '', filter = false, groups = []] = JSON.parse(
        JSON.stringify(args)
    )
    let handleResult = (result: any) => {
        return result
    }

    if (tag === 'album') {
        if (!groups.length) {
            tag = 'date'
            groups = ['album']
            filter = false
        }
        handleResult = (result: any) => {
            if (result?.length) {
                return result.map(({ album, date }: any) => ({
                    album,
                    date: date?.[0].date,
                }))
            }
            return result
        }
    }

    return {
        nextArgs: [tag, filter, groups],
        handleResult,
    }
}

export const dbAboutHandler: (
    client: MPDApi.ClientAPI,
    route?: string
) => WrappedFunction = (client) => {
    return async ({ req, res }) => {
        const args = Array.isArray(req?.body?.fnArgs) ? req.body.fnArgs : []
        const fn = (client.api as AnyClient)['db']['list']
        const { nextArgs, handleResult } = getHandlers(args)
        const result = await fn(...nextArgs)
        res.json({
            code: 200,
            message: 'OK',
            data: handleResult(result),
        })
    }
}
