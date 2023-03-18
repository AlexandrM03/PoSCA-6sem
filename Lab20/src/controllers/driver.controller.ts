import { Router, Request, Response } from 'express';
import * as driverService from '../services/driver.service.js';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
	try {
		const createdDriver = await driverService.register(req.body);
		res.render('driver/drivers', { title: 'Driver', drivers: [createdDriver] });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/register', async (req: Request, res: Response) => {
	res.render('driver/register', { title: 'Register' })
});

router.put('/telephone', async (req: Request, res: Response) => {
	try {
		const updatedDriver = await driverService.updateDriverTelephone(req.body);
		res.render('driver/drivers', { title: 'Driver', drivers: [updatedDriver] });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/telephone', async (req: Request, res: Response) => {
	res.render('driver/telephone', { title: 'Update Telephone' });
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const driver = await driverService.getDriver(+req.params.id);
		res.json(driver);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		const deletedDriver = await driverService.deleteDriver(+req.params.id);
		res.json(deletedDriver);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/', async (req: Request, res: Response) => {
	try {
		const drivers = await driverService.getDrivers();
		res.render('driver/drivers', { title: 'Drivers', drivers: drivers });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

export default router;