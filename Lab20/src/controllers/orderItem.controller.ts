import { Router, Request, Response } from 'express';
import * as orderItemService from '../services/orderItem.service.js';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
	try {
		const createdOrderItem = await orderItemService.addOrderItem(req.body);
		res.render('orderItem/orderItems', { title: 'Order item', orderItems: [createdOrderItem] });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/', async (req: Request, res: Response) => {
	try {
		const orderItems = await orderItemService.getOrderItems();
		res.render('orderItem/orderItems', { title: 'Order items', orderItems: orderItems });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.get('/update', async (req: Request, res: Response) => {
	try {
		res.render('orderItem/update', { title: 'Update order item' });
	} catch (err: any) {
		res.status(500).json({ error: err.message })
	}
});

router.get('/create', async (req: Request, res: Response) => {
	try {
		res.render('orderItem/create', { title: 'Create order item' });
	} catch (err: any) {
		res.status(500).json({ error: err.message })
	}
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const orderItem = await orderItemService.getOrderItem(+req.params.id);
		res.json(orderItem);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.put('/', async (req: Request, res: Response) => {
	try {
		const updatedOrderItem = await orderItemService.updateOrderItem(req.body);
		res.render('orderItem/orderItems', { title: 'Order item', orderItems: [updatedOrderItem] });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		const deletedOrderItem = await orderItemService.deleteOrderItem(+req.params.id);
		res.render('orderItem/orderItems', { title: 'Order item', orderItems: [deletedOrderItem] });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

export default router;