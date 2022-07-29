import { Router } from 'express'
import { AlbumController } from '../controllers/Api/Web'

const router = Router()

router.post(`/album`, AlbumController.perform)

export default router
