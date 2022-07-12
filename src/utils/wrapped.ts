import type { NextFunction, Request, Response } from 'express'

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
      next(e)
    }
  }
}

export default wrapped
