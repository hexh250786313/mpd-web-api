import type { Response } from 'express'

import MPD from '../providers/MPD'
import { formatSong } from './format-song'

export async function playSongs({
    query,
    res,
    append = false,
}: {
    query: string[]
    res: Response
    append?: boolean
}) {
    let data: any[] = []
    if (query.length) {
        try {
            if (!append) {
                await MPD.client!.api.queue.clear()
            }
            await MPD.client!.api.db.searchadd(
                `(${query.join(' AND ')})`
                // 'position',
                // '0'
            )
            await MPD.client!.api.playback.play()
            data = (await MPD.client!.api.queue.info()) || []
            return res.status(200).json({
                code: 200,
                message: 'OK',
                data: formatSong(data),
            })
        } catch (e: any) {
            return res.status(400).json({
                code: 400,
                message: e.message,
                data: null,
            })
        }
    }
    return res.status(400).json({
        code: 400,
        message: 'empty query',
        data: null,
    })
}
