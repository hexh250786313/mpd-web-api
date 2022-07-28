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
import Mpd from './providers/Mpd'

async function main() {
    try {
        Mpd.connect().then(() => {
            App.loadConfiguration()
            App.loadServer()
        })
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

main()
