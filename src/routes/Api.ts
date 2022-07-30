import { Router } from 'express'
import { AlbumController, PlayingController } from '../controllers/Api/Web'

const router = Router()

router.post(`/album`, AlbumController.perform)
router.post(`/playing/play`, PlayingController.perform)

export default router
