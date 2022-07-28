import { Router } from 'express'
import NativeController from '../controllers/Api/Native'
import MpdClient from '../providers/Mpd'

const router = Router()

MpdClient.names()

// const client = await mpdApi.connect({ host: '127.0.0.1', port: 6600 })

// const names = Object.keys(client.api).flatMap((ns) => {
// return Object.keys((client.api as AnyClient)[ns]).map((name) => [ns, name])
// })

router.post('/auth/login', NativeController.perform)

export default router
