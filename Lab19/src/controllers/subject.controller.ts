import { Router, Request, Response } from 'express';
import { createSubject, getSubjects, updateSubject, deleteSubject } from '../services/subject.service.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	const subjects = await getSubjects();
	res.status(200).json(subjects);
});

router.post('/', async (req: Request, res: Response) => {
	try {
		const subject = await createSubject(req.body);
		res.status(201).json(subject);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.put('/', async (req: Request, res: Response) => {
	try {
		const subject = await updateSubject(req.body);
		res.status(201).json(subject);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.delete('/:subject', async (req: Request, res: Response) => {
	try {
		const subject = await deleteSubject(req.params.subject);
		res.status(200).json(subject);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

export default router;