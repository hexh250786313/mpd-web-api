import type { NextFunction, Request, Response } from 'express'
import type { IMpdNativeRoute } from '../../providers/Mpd'

import Mpd from '../../providers/Mpd'

class NativeController {
    public static perform(
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        const [ns, name] = req.route.path
            .replace(/(^\/|\/$)/g, '')
            .split('/') as IMpdNativeRoute

        const args = Array.isArray(req?.body?.fnArgs) ? req.body.fnArgs : []
        const fn = (Mpd.client!.api[ns] as any)[name]
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
    }
}

export default NativeController
