import { Router } from 'express';

import loginController from '../controllers/login';
export const router = Router()

router.post('/', loginController.getProduct)

export default router

