import express from 'express';
import loginService from '../services/login'

export class LoginController {
    getProduct = async (req: express.Request, res: express.Response) => {
		try {
            const key = await loginService.login(req.body.username, req.body.password)
			res.json({key: key})
		}
		catch (err) {
		    res.status(500).send(err)
		}
	}
}

export default new LoginController()
