import type { NextFunction, Request, Response } from 'express'
import { body } from 'express-validator'
import MPD from '../../../providers/MPD'

export class PlayingController {
    public static perform(
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        const search = MPD.client!.api.queue.search
        const deleteId = MPD.client!.api.queue.deleteid
        const searchAdd = MPD.client!.api.db.searchadd
        const playNext = MPD.client!.api.playback.next

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
