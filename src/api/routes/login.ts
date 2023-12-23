import { Router } from 'express';

import loginController from '../controllers/login';
export const router = Router()

router.post('/', loginController.login)
router.post('/signup', loginController.signup)

export default router

