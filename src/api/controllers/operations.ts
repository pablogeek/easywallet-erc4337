import express from 'express';
import operationsService from '../services/operations'

export class OperationsController {
    send = async (req: express.Request, res: express.Response) => {
		try {
            console.log('send request');
            const key = await operationsService.send(
                req.body.address, 
                req.body.amount, 
                req.headers.authorization!)
			res.json({address: key})
		}
		catch (err) {
		    res.status(500).send(err)
		}
	}
}

export default new OperationsController()