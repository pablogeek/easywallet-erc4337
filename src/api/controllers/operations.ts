import express from 'express';
import operationsService from '../services/operations'

export class OperationsController {
    send = async (req: express.Request, res: express.Response) => {
		try {
            const key = await operationsService.send(
                req.body.address, 
                req.body.amount, 
                req.body.username, 
                req.body.password)
			res.json({address: key})
		}
		catch (err) {
		    res.status(500).send(err)
		}
	}
}

export default new OperationsController()