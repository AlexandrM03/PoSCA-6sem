import { Router, Request, Response } from 'express';
import { getFaculties, createFaculty, updateFaculty, deleteFaculty, getSubjectsByFaculty } from '../services/faculty.service.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	const faculties = await getFaculties();
	res.status(200).json(faculties);
});

router.post('/', async (req: Request, res: Response) => {
	try {
		const faculty = await createFaculty(req.body);
		res.status(201).json(faculty);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.put('/', async (req: Request, res: Response) => {
	try {
		const faculty = await updateFaculty(req.body);
		res.status(201).json(faculty);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.delete('/:faculty', async (req: Request, res: Response) => {
	try {
		const faculty = await deleteFaculty(req.params.faculty);
		res.status(200).json(faculty);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

router.get('/:faculty/subjects', async (req: Request, res: Response) => {
	try {
		const subjects = await getSubjectsByFaculty(req.params.faculty);
		res.status(200).json(subjects);
	} catch (err: any) {
		console.error(err.message);
		res.status(500).json({ message: err.message });
	}
});

export default router;