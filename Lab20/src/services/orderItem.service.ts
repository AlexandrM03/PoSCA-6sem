import prisma from '../client/prisma.js';
import { order_items } from '@prisma/client';

export const addOrderItem = async (orderItem: order_items) => {
	try {
		const createdOrderItem = await prisma.order_items.create({
			data: {
				name: orderItem.name,
				volume: +orderItem.volume,
				weight: +orderItem.weight,
				order_id: +orderItem.order_id,
			},
		});

		return createdOrderItem;
	} catch (err: any) {
		throw new Error(`Error creating order item: ${err.message}`);
	}
};

export const getOrderItems = async () => {
	try {
		const orderItems = await prisma.order_items.findMany();

		return orderItems;
	} catch (err: any) {
		throw new Error(`Error getting order items: ${err.message}`);
	}
};

export const getOrderItem = async (id: number) => {
	try {
		const orderItem = await prisma.order_items.findUnique({
			where: {
				id
			}
		});

		return orderItem;
	} catch (err: any) {
		throw new Error(`Error getting order items: ${err.message}`);
	}
}

export const updateOrderItem = async (data: order_items) => {
	try {
		const orderItem = await prisma.order_items.update({
			where: {
				id: +data.id
			},
			data: {
				name: data.name,
				volume: +data.volume,
				weight: +data.weight,
			}
		})

		return orderItem;
	} catch (err: any) {
		throw new Error(`Error updating order item: ${err.message}`);
	}
}

export const deleteOrderItem = async (id: number) => {
	try {
		const deletedOrderItem = await prisma.order_items.delete({
			where: {
				id
			}
		});

		return deletedOrderItem;
	} catch (err: any) {
		throw new Error(`Error deleting order item: ${err.message}`);
	}
};