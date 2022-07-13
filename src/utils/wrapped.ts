import type { NextFunction, Request, Response } from 'express'
import { RequestError } from '../app'

interface WrappedContext {
  req: Request
  res: Response
  next: NextFunction
}

type WrappedFunction = (ctx: WrappedContext) => Promise<void>

/**
 * Async Express route error handler
 */
function wrapped(fn: WrappedFunction) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn({ req, res, next })
    } catch (e) {
      console.error('Route exception', e)
      res.json({
        code: (e as RequestError).status || 500,
        message: 'Failed: ' + e,
      })
      next(e)
    }
  }
}

export default wrapped
