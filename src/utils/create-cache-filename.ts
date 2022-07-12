import createHash from './create-hash'
import path from 'node:path'

/**
 * Creates a cache filename
 */
function createCacheFilename(filename: string) {
  const newFilename = createHash(filename)
  return path.join(process.cwd(), 'cache', newFilename)
}

export default createCacheFilename
