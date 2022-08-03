import type { NextFunction, Request, Response } from 'express'
import { body } from 'express-validator'
import MPD from '../../../providers/MPD'
import { formatSong, validated } from '../../../utils'

export class AlbumController {
    public static get(req: Request, res: Response, next: NextFunction) {
        validated({ req, res, next }, async () => {
            const { album, artist } = req.body
            const query = []
            let data = null
            if (album) {
                query.push(`(album contains '${album}')`)
            }
            if (Array.isArray(artist) && artist.length) {
                artist.forEach((a) => {
                    query.push(`(artist contains '${a}')`)
                })
            }
            try {
                if (query.length) {
                    data = (
                        await MPD.client!.api.db.search(
                            `(${query.join(' AND ')})`
                        )
                    )?.sort(
                        (a: any, b: any) => parseInt(a.date) - parseInt(b.date)
                    )
                } else {
                    data = (
                        await (MPD.client!.api.db.list as any)(
                            'artist',
                            false,
                            'date',
                            'album'
                        )
                    )
                        .map(({ album, date }: any) => ({
                            album,
                            date: date?.find((d: any) => d.date)?.date,
                            artist: date
                                ?.find(
                                    (d: any) =>
                                        Array.isArray(d.artist) &&
                                        d.artist.length
                                )
                                ?.artist?.map((a: any) => a.artist)
                                ?.filter((t: any) => t),
                        }))
                        .sort(
                            (a: any, b: any) =>
                                parseInt(a.date) - parseInt(b.date)
                        )
                }
                if (!Array.isArray(data)) {
                    data = []
                }
            } catch (e: any) {
                return res.status(400).json({
                    code: 400,
                    message: e.message,
                    data: null,
                })
            }
            return res.json({
                code: 200,
                message: 'OK',
                data: formatSong(data),
            })
        })
    }

    public static getValidate() {
        return [
            body('album')
                .isString()
                .optional()
                .withMessage("'album' must be string"),
            body('artist')
                .isArray()
                .optional()
                .withMessage("'artist' must be array"),
            body('artist.*')
                .isString()
                .optional()
                .withMessage("'artist' elements type must be string"),
        ]
    }
}
