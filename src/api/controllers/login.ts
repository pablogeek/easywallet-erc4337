import express from 'express';
import loginService from '../services/login'

export class LoginController {
    login = async (req: express.Request, res: express.Response) => {
		try {
            const logingResponse = await loginService.login(req.body.username, req.body.password);
			res.json(logingResponse);
		}
		catch (err) {
            console.log(err);
		    res.status(500).send(err)
		}
	}

    signup = async (req: express.Request, res: express.Response) => {
		try {
            const key = await loginService.signup(req.body.username, req.body.password);
			res.json({address: key});
		}
		catch (err) {
		    res.status(500).send(err)
		}
	}
}

export default new LoginController()
