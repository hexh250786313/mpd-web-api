import fs from 'node:fs'
import createCacheFilename from './create-cache-filename'
import type { Readable } from 'node:stream'

/**
 * Basic file cache writer/reader
 */
async function cacheFile(
  filename: string,
  content: () => Promise<Buffer>
): Promise<Readable> {
  const dest = createCacheFilename(filename)

  const exists = await fs.promises
    .access(dest, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)

  if (!exists) {
    const data = await content()
    await fs.promises.writeFile(dest, data)
  }

  return fs.createReadStream(dest)
}

export default cacheFile
