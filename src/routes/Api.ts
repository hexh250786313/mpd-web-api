import { Router } from 'express'
import { ConnectController } from '../controllers/Api/Client'
import { AlbumController, PlayingController } from '../controllers/Api/Web'

const router = Router()

router.post(
    `/client/connect`,
    ConnectController.validate(),
    ConnectController.perform
)
router.post(
    `/web/album/get`,
    AlbumController.getValidate(),
    AlbumController.get
)
router.post(`/web/playing/play`, PlayingController.perform)

export default router
