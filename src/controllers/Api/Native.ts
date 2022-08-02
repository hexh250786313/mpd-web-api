import type { NextFunction, Request, Response } from 'express'
import type { IMPDNativeRoute } from '../../providers/MPD'

import { body } from 'express-validator'
import MPD from '../../providers/MPD'
import { validated } from '../../utils'

class NativeController {
    public static perform(
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        validated({ req, res, next }, () => {
            const [ns, name] = req.route.path
                .replace(/(^\/|\/$)/g, '')
                .split('/') as IMPDNativeRoute

            const args = req?.body?.commandArgs ?? []

            const fn = (MPD.client!.api[ns] as any)[name]
            fn(...args)
                .then((result: any) => {
                    res.json({
                        code: 200,
                        message: 'OK',
                        data: result,
                    })
                })
                .catch((e: any) => {
                    next(new Error(e))
                })
        })
    }

    public static validate() {
        return [
            body('commandArgs')
                .isArray()
                .optional()
                .withMessage('body must be an array'),
            body('commandArgs.*')
                .custom((value) =>
                    ['string', 'number', 'boolean'].includes(typeof value)
                )
                .optional()
                .withMessage(
                    "body's elements' type must be one of [string, number, boolean]"
                ),
        ]
    }
}

export default NativeController
