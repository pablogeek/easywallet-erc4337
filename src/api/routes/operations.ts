import { Router } from 'express';

import loginController from '../controllers/operations';
export const router = Router()

router.post('/send', loginController.send)

export default router