import type { NextFunction, Request, Response } from 'express'

import { validationResult } from 'express-validator'
import Log from '../middlewares/Log'

export function validated(
    params: { req: Request; res: Response; next: NextFunction },
    callback: any
) {
    const errors = validationResult(params.req)

    if (!errors.isEmpty()) {
        const message = errors
            .array()
            .map((e) => {
                return `'${e.value}' at ${e.param}: ${e.msg}`
            })
            .filter(
                (i, index, self) => self.findIndex((t) => t === i) === index
            )
            .join('; ')

        Log.warn('Request :: ' + message)

        params.res.status(400).json({
            code: 400,
            message,
            data: null,
        })
    } else {
        try {
            callback()
        } catch (e: any) {
            params.next(new Error(e))
        }
    }
}
