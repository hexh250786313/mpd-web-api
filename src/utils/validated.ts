import type { NextFunction, Request, Response } from 'express'

import { validationResult } from 'express-validator'

export function validated(
    params: { req: Request; res?: Response; next: NextFunction },
    callback: any
) {
    console.log('---------------')
    const errors = validationResult(params.req)

    if (!errors.isEmpty()) {
        params.next(
            new Error(
                errors
                    .array()
                    .map((e) => {
                        return `"${e.value}" at ${e.param}: ${e.msg}`
                    })
                    .filter(
                        (i, index, self) =>
                            self.findIndex((t) => t === i) === index
                    )
                    .join('; ')
            )
        )
    } else {
        callback()
    }
}
