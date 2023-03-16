import prisma from '../client/prisma.js';
import { auditoriums } from '@prisma/client';

export const getAuditoriums = async () => {
	const auditoriums = await prisma.auditoriums.findMany();
	return auditoriums;
}

export const createAuditorium = async (data: auditoriums) => {
	const { auditorium, auditorium_name, auditorium_type, auditorium_capacity } = data;

	try {
		const newAuditorium = await prisma.auditoriums.create({
			data: {
				auditorium,
				auditorium_name,
				auditorium_type,
				auditorium_capacity
			}
		});

		return newAuditorium;
	} catch (err: any) {
		throw new Error(`Failed to add auditorium: ${err.message}`);
	}
}

export const updateAuditorium = async (data: auditoriums) => {
	try {
		const auditorium = await prisma.auditoriums.update({
			where: {
				auditorium: data.auditorium,
			},
			data,
		});

		return auditorium;
	} catch (err: any) {
		throw new Error(`Failed to update auditorium: ${err.message}`);
	}
}

export const deleteAuditorium = async (auditorium: string) => {
	try {
		const deletedAuditorium = await prisma.auditoriums.delete({
			where: {
				auditorium,
			},
		});

		return deletedAuditorium;
	} catch (err: any) {
		throw new Error(`Failed to delete auditorium: ${err.message}`);
	}
}

export const getAuditoriumsSameCount = async () => {
	try {
		const auditoriums = prisma.auditoriums.groupBy({
			by: ['auditorium_capacity', 'auditorium_type'],
			_count: {
				_all: true,
			}
		});

		return auditoriums;
	} catch (err: any) {
		throw new Error(`Failed to get auditoriums: ${err.message}`);
	}
}

export const updateAndRollbackAuditoriumCapacity = async () => {
	let auditoriums;

	try {
		await prisma.$transaction(async (prisma) => {
			await prisma.auditoriums.updateMany({
				data: { auditorium_capacity: { increment: 100 } },
			});

			auditoriums = await prisma.auditoriums.findMany();

			throw new Error('Rollback');
		});
	} catch (err: any) {
		return auditoriums;
	}
}