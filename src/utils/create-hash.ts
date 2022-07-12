import crypto from 'node:crypto'

function createHash(s: string) {
  crypto.createHash('sha256').update(s).digest('hex')
}

export default createHash
