import { Router, Request, Response } from 'express';
import { getAuditoriumTypes, createAuditoriumType, updateAuditoriumType, deleteAuditoriumType, getAuditoriumsByType } from '../services/auditoriumType.service.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	const auditorium_types = await getAuditoriumTypes();
	res.status(200).json(auditorium_types);
});

router.post('/', async (req: Request, res: Response) => {
	try {
		const auditorium_type = await createAuditoriumType(req.body);
		res.status(201).json(auditorium_type);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.put('/', async (req: Request, res: Response) => {
	try {
		const auditorium_type = await updateAuditoriumType(req.body);
		res.status(201).json(auditorium_type);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.delete('/:auditorium_type', async (req: Request, res: Response) => {
	try {
		const auditorium_type = await deleteAuditoriumType(req.params.auditorium_type);
		res.status(200).json(auditorium_type);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.get('/:auditorium_type/auditoriums', async (req: Request, res: Response) => {
	try {
		const auditoriums = await getAuditoriumsByType(req.params.auditorium_type);
		res.status(200).json(auditoriums);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

export default router;