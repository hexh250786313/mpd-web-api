import { Router } from 'express'
import { UrlController } from '../controllers/Api/Client'
import { AlbumController, PlayingController } from '../controllers/Api/Web'

const router = Router()

router.post(`/web/album`, AlbumController.perform)
router.post(`/client/url`, UrlController.validate(), UrlController.perform)
router.post(`/web/playing/play`, PlayingController.perform)

export default router
