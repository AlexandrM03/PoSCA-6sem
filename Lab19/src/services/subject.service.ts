import prisma from '../client/prisma.js';
import { subjects } from '@prisma/client';

export const getSubjects = async () => {
	const subjects = await prisma.subjects.findMany();
	return subjects;
}

export const createSubject = async (data: subjects) => {
	try {
		const newSubject = await prisma.subjects.create({
			data,
		});

		return newSubject;
	} catch (err: any) {
		throw new Error(`Failed to add subject: ${err.message}`);
	}
}

export const updateSubject = async (data: subjects) => {
	try {
		const subject = await prisma.subjects.update({
			where: {
				subject: data.subject,
			},
			data,
		});

		return subject;
	} catch (err: any) {
		throw new Error(`Failed to update subject: ${err.message}`);
	}
}

export const deleteSubject = async (subject: string) => {
	try {
		const deletedSubject = await prisma.subjects.delete({
			where: {
				subject,
			},
		});

		return deletedSubject;
	} catch (err: any) {
		throw new Error(`Failed to delete subject: ${err.message}`);
	}
}