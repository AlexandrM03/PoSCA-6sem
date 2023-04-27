import { Router, Request, Response } from 'express';

export class AbilityHandler {
	public router: Router;

	constructor() {
		this.router = Router();

		this.router.get('/', this.getAllRules.bind(this));
	}

	private async getAllRules(req: Request, res: Response) {
		if (req.ability) {
			res.status(200).send(req.ability.rules);
		} else {
			res.status(401).send('Unauthorized');
		}
	}
}