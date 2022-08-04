import { Router } from 'express'
import { ConnectController } from '../controllers/Api/Client'
import { AlbumController, PlayingController } from '../controllers/Api/Web'

const router = Router()

router.post(
    `/client/connect`,
    ConnectController.validate(),
    ConnectController.perform
)
router.post(`/web/album/get`, AlbumController.validate(), AlbumController.get)
router.post(
    `/web/album/play`,
    AlbumController.validate(),
    AlbumController.play({ append: false })
)
router.post(
    `/web/album/append`,
    AlbumController.validate(),
    AlbumController.play({ append: true })
)
router.post(`/web/playing/play`, PlayingController.perform)

export default router
