import { Router, Request, Response } from 'express';
import {
	getAuditoriums,
	createAuditorium,
	updateAuditorium,
	deleteAuditorium,
	updateAndRollbackAuditoriumCapacity
} from '../services/auditorium.service.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	const auditoriums = await getAuditoriums();
	res.status(200).json(auditoriums);
});

router.post('/', async (req: Request, res: Response) => {
	try {
		const auditorium = await createAuditorium(req.body);
		res.status(201).json(auditorium);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.put('/', async (req: Request, res: Response) => {
	try {
		const auditorium = await updateAuditorium(req.body);
		res.status(201).json(auditorium);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.delete('/:auditorium', async (req: Request, res: Response) => {
	try {
		const auditorium = await deleteAuditorium(req.params.auditorium);
		res.status(200).json(auditorium);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.put('/transaction', async (req: Request, res: Response) => {
	try {
		const auditorium = await updateAndRollbackAuditoriumCapacity();
		res.status(201).json(auditorium);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

export default router;