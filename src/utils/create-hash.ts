import crypto from 'node:crypto'

function createHash(s: string) {
  return crypto.createHash('sha256').update(s).digest('hex')
}

export default createHash
