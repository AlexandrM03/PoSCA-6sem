import prisma from '../client/prisma.js';
import { auditorium_types } from '@prisma/client';

export const getAuditoriumTypes = async () => {
	const auditorium_types = await prisma.auditorium_types.findMany();
	return auditorium_types;
}

export const createAuditoriumType = async (data: auditorium_types) => {
	const { auditorium_type, auditorium_typename } = data;

	try {
		const newAuditoriumType = await prisma.auditorium_types.create({
			data: {
				auditorium_type,
				auditorium_typename
			}
		});

		return newAuditoriumType;
	} catch (err: any) {
		throw new Error(`Failed to add auditorium type: ${err.message}`);
	}
}

export const updateAuditoriumType = async (data: auditorium_types) => {
	try {
		const auditorium_type = await prisma.auditorium_types.update({
			where: {
				auditorium_type: data.auditorium_type,
			},
			data,
		});

		return auditorium_type;
	} catch (err: any) {
		throw new Error(`Failed to update auditorium type: ${err.message}`);
	}
}

export const deleteAuditoriumType = async (auditorium_type: string) => {
	try {
		const deletedAuditoriumType = await prisma.auditorium_types.delete({
			where: {
				auditorium_type,
			},
		});

		return deletedAuditoriumType;
	} catch (err: any) {
		throw new Error(`Failed to delete auditorium type: ${err.message}`);
	}
}

export const getAuditoriumsByType = async (auditorium_type: string) => {
	try {
		const auditoriums = await prisma.auditorium_types.findUnique({
			where: { auditorium_type },
			select: {
				auditorium_type: true,
				auditoriums: {
					select: { auditorium: true }
				}
			}
		})

		return auditoriums;
	} catch (err: any) {
		throw new Error(`Failed to get auditoriums by type: ${err.message}`);
	}
}