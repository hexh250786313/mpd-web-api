import { createApp } from './app'
import type { Configuration } from './types'

async function main() {
  const config: Configuration = null
  try {
    await createApp(config)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
