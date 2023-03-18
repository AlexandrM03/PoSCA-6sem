import { Router, Request, Response } from 'express';
import * as orderService from '../services/order.service.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
	try {
		const createdOrder = await orderService.createOrder(req.body);
		res.render('order/orders', { title: 'Order', orders: [createdOrder] });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/', async (req: Request, res: Response) => {
	try {
		const orders = await orderService.getOrders();
		res.render('order/orders', { title: 'Orders', orders: orders });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/update', async (req: Request, res: Response) => {
	try {
		res.render('order/update', { title: 'Update order' });
	} catch (err: any) {
		res.status(500).json({ error: err.message })
	}
});

router.get('/create', async (req: Request, res: Response) => {
	try {
		res.render('order/create', { title: 'Create order' });
	} catch (err: any) {
		res.status(500).json({ error: err.message })
	}
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const order = await orderService.getOrder(+req.params.id);
		res.json(order);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.put('/', async (req: Request, res: Response) => {
	try {
		const updatedOrder = await orderService.updateOrder(req.body);
		res.render('order/orders', { title: 'Order', orders: [updatedOrder] });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		const deletedOrder = await orderService.deleteOrder(+req.params.id);
		res.json(deletedOrder);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

export default router;
