import { Router, Request, Response } from 'express';
import * as userService from '../services/user.service.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
	try {
		const createdUser = await userService.register(req.body);
		res.render('user/users', { title: 'User', users: [createdUser] });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/register', async (req: Request, res: Response) => {
	res.render('user/register', { title: 'Register' })
});

router.put('/telephone', async (req: Request, res: Response) => {
	try {
		const updatedUser = await userService.updateUserTelephone(req.body);
		res.render('user/users', { title: 'User', users: [updatedUser] });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/telephone', async (req: Request, res: Response) => {
	res.render('user/telephone', { title: 'Update Telephone' });
	res.render('user/telephone', { title: 'Update Telephone' });
});

router.get('/:username', async (req: Request, res: Response) => {
	try {
		const user = await userService.getUser(req.params.username);
		res.json(user);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.delete('/:username', async (req: Request, res: Response) => {
	try {
		const deletedUser = await userService.deleteUser(req.params.username);
		res.json(deletedUser);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/', async (req: Request, res: Response) => {
	try {
		const users = await userService.getUsers();
		res.render('user/users', { title: 'Users', users: users });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

export default router;