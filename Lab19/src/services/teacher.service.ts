import prisma from '../client/prisma.js';
import { teachers } from '@prisma/client';

export const getTeachers = async () => {
	const teachers = await prisma.teachers.findMany();
	return teachers;
}

export const createTeacher = async (data: teachers) => {
	try {
		const newTeacher = await prisma.teachers.create({
			data,
		});

		return newTeacher;
	} catch (err: any) {
		throw new Error(`Failed to add teacher: ${err.message}`);
	}
}

export const updateTeacher = async (data: teachers) => {
	try {
		const teacher = await prisma.teachers.update({
			where: {
				teacher: data.teacher,
			},
			data,
		});

		return teacher;
	} catch (err: any) {
		throw new Error(`Failed to update teacher: ${err.message}`);
	}
}

export const deleteTeacher = async (teacher: string) => {
	try {
		const deletedTeacher = await prisma.teachers.delete({
			where: {
				teacher,
			},
		});

		return deletedTeacher;
	} catch (err: any) {
		throw new Error(`Failed to delete teacher: ${err.message}`);
	}
}