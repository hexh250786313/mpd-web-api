// import { createApp } from './app'
// import type { Configuration } from './types'

// async function main() {
// const config: Configuration = null
// try {
// await createApp(config)
// } catch (error) {
// console.error(error)
// process.exit(1)
// }
// }

import App from './providers/App'

async function main() {
    try {
        App.loadConfiguration()
        App.loadServer()
        App.loadMpdClient()
        App.loadServerErrorHandler()
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

main()
