import createHash from './create-hash'
import { join } from 'node:path'

/**
 * Creates a cache filename
 */
function createCacheFilename(filename: string) {
    const newFilename = createHash(filename)
    return join(process.cwd(), 'cache', newFilename)
}

export default createCacheFilename
