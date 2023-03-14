import { Router, Request, Response } from 'express';
import {
	createPulpit,
	getPulpits,
	updatePulpit,
	deletePulpit,
	getPulpitsWithoutTeachers,
	getPulpitsWithVladimir,
	getPulpitsWithTeachersCountPagination
} from '../services/pulpits.service.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	const pulpits = await getPulpits();
	res.status(200).json(pulpits);
});

router.post('/', async (req: Request, res: Response) => {
	try {
		const pulpit = await createPulpit(req.body);
		res.status(201).json(pulpit);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.put('/', async (req: Request, res: Response) => {
	try {
		const pulpit = await updatePulpit(req.body);
		res.status(201).json(pulpit);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.delete('/:pulpit', async (req: Request, res: Response) => {
	try {
		const pulpit = await deletePulpit(req.params.pulpit);
		res.status(200).json(pulpit);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.get('/puplitsWithoutTeachers', async (req: Request, res: Response) => {
	try {
		const pulpits = await getPulpitsWithoutTeachers();
		res.status(200).json(pulpits);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.get('/pulpitsWithVladimir', async (req: Request, res: Response) => {
	try {
		const pulpits = await getPulpitsWithVladimir();
		res.status(200).json(pulpits);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.get('/pulpitsWithTeachersCount/:page', async (req: Request, res: Response) => {
	try {
		const pulpits = await getPulpitsWithTeachersCountPagination(+req.params.page);
		res.status(200).json(pulpits);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

export default router;