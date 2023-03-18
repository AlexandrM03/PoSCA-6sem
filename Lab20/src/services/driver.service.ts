import prisma from '../client/prisma.js';
import { drivers } from '@prisma/client';

export const register = async (driver: drivers) => {
	try {
		const createdDriver = await prisma.drivers.create({
			data: { ...driver },
		});

		return createdDriver;
	} catch (err: any) {
		throw new Error(`Error creating driver: ${err.message}`);
	}
}

export const getDrivers = async () => {
	try {
		const drivers = await prisma.drivers.findMany();

		return drivers;
	} catch (err: any) {
		throw new Error(`Error getting drivers: ${err.message}`);
	}
}

export const getDriver = async (id: number) => {
	try {
		const driver = await prisma.drivers.findUnique({
			where: {
				id
			}
		});

		return driver;
	} catch (err: any) {
		throw new Error(`Error getting driver: ${err.message}`);
	}
}

export const updateDriverTelephone = async (data: drivers) => {
	try {
		const driver = await prisma.drivers.update({
			where: {
				id: +data.id
			},
			data: {
				telephone: data.telephone
			}
		});

		return driver;
	} catch (err: any) {
		throw new Error(`Error updating driver: ${err.message}`);
	}
}

export const deleteDriver = async (id: number) => {
	try {
		const deletedDriver = await prisma.drivers.delete({
			where: {
				id
			}
		});

		return deletedDriver;
	} catch (err: any) {
		throw new Error(`Error deleting driver: ${err.message}`);
	}
}