import prisma from '../client/prisma.js';
import { orders } from '@prisma/client';

export const createOrder = async (order: orders) => {
	try {
		const createdOrder = await prisma.orders.create({
			data: { ...order },
		});

		return createdOrder;
	} catch (err: any) {
		throw new Error(`Error creating order: ${err.message}`);
	}
};

export const getOrders = async () => {
	try {
		const orders = await prisma.orders.findMany();

		return orders;
	} catch (err: any) {
		throw new Error(`Error getting orders: ${err.message}`);
	}
};

export const getOrder = async (id: number) => {
	try {
		const order = await prisma.orders.findUnique({
			where: {
				id
			}
		});

		return order;
	} catch (err: any) {
		throw new Error(`Error getting order: ${err.message}`);
	}
};

export const updateOrder = async (data: orders) => {
	try {
		const order = await prisma.orders.update({
			where: {
				id: +data.id
			},
			data: {
				start_address: data.start_address,
				end_address: data.end_address
			}
		});

		return order;
	} catch (err: any) {
		throw new Error(`Error updating order: ${err.message}`);
	}
};

export const deleteOrder = async (id: number) => {
	try {
		const deletedOrder = await prisma.orders.delete({
			where: {
				id
			}
		});

		return deletedOrder;
	} catch (err: any) {
		throw new Error(`Error deleting order: ${err.message}`);
	}
};