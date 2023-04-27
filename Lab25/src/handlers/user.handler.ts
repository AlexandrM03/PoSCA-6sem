import { Router, Request, Response } from 'express';
import prisma from '../client/prisma.js';
import { UsersCASL } from '../models/userCasl.model.js';

export class UserHandler {
	public router: Router;

	constructor() {
		this.router = Router();

		this.router.get('/', this.getAllUsers.bind(this));
		this.router.get('/:id', this.getOneUser.bind(this));
	}

	private async getAllUsers(req: Request, res: Response) {
		try {
			req.ability?.throwUnlessCan('manage', 'all');
			const users = await prisma.users.findMany();
			res.status(200).json(users);
		} catch (err) {
			res.status(500).send(err);
		}
	}

	private async getOneUser(req: Request, res: Response) {
		try {
			req.ability?.throwUnlessCan('read', new UsersCASL(+req.params.id));
			const user = await prisma.users.findUnique({ where: { id: +req.params.id } });
			if (user) {
				res.status(200).json(user);
			} else {
				res.status(404).send('Not found');
			}
		} catch (err) {
			res.status(500).send(err);
		}
	}

}