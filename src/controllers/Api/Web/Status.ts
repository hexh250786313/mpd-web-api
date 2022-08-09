import type { NextFunction, Request, Response } from 'express'
import type { RawSong } from '../../../utils'

import MPD from '../../../providers/MPD'
import { formatSong, validated } from '../../../utils'
import { IPlaying } from '../../../types'

export class StatusController {
    public static get(req: Request, res: Response, next: NextFunction) {
        validated({ req, res, next }, async () => {
            const queue: RawSong[] = await MPD.client!.api.queue.info()
            const current: RawSong = await MPD.client!.api.status.currentsong()
            const playing: IPlaying = await MPD.client!.api.status.get()
            return res.status(200).json({
                code: 200,
                message: 'OK',
                data: {
                    queue: Array.isArray(queue) ? formatSong(queue) : [],
                    current: current ? formatSong([current])[0] : null,
                    playing,
                },
            })
        })
    }
}
