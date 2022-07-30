import type { NextFunction, Request, Response } from 'express'
import { body } from 'express-validator'
import Mpd from '../../../providers/Mpd'

export class PlayingController {
    public static perform(
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        const search = Mpd.client!.api.queue.search
        const deleteId = Mpd.client!.api.queue.deleteid
        const searchAdd = Mpd.client!.api.db.searchadd
        const playNext = Mpd.client!.api.playback.next

        const args = Array.isArray(req?.body?.fnArgs) ? req.body.fnArgs : []

        res.json(null)
    }

    public static validate(): any {
        return [
            body('fnArgs')
                .isArray()
                .optional()
                .withMessage('fnArgs must be an array'),
            body('fnArgs.*')
                .isString()
                .isInt()
                .isBoolean()
                .optional()
                .withMessage("fnArgs's elements must be string or number"),
        ]
    }
}
