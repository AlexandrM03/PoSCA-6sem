import { Router, Request, Response } from 'express';
import { createTeacher, getTeachers, updateTeacher, deleteTeacher } from '../services/teacher.service.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	const teachers = await getTeachers();
	res.status(200).json(teachers);
});

router.post('/', async (req: Request, res: Response) => {
	try {
		const teacher = await createTeacher(req.body);
		res.status(201).json(teacher);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.put('/', async (req: Request, res: Response) => {
	try {
		const teacher = await updateTeacher(req.body);
		res.status(201).json(teacher);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.delete('/:teacher', async (req: Request, res: Response) => {
	try {
		const teacher = await deleteTeacher(req.params.teacher);
		res.status(200).json(teacher);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

export default router;