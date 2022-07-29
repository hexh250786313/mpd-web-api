import type { NextFunction, Request, Response } from 'express'

export class AlbumController {
    public static perform(
        req: Request,
        res: Response,
        next: NextFunction
    ): any {
        // console.log(next)
        // console.log(req.body)
        // console.log(req.get('Content-Type'))
        res.json(null)
    }
}
