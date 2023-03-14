import prisma from '../client/prisma.js';
import { faculties } from '@prisma/client';

export const getFaculties = async () => {
	const faculties = await prisma.faculties.findMany();
	return faculties;
}

export const createFaculty = async (data: FacultyInput) => {
	const { faculty, faculty_name, pulpits } = data;

	try {
		const newFaculty = await prisma.faculties.create({
			data: {
				faculty,
				faculty_name
			}
		});

		if (pulpits && pulpits.length > 0) {
			const pulpitData = pulpits.map((p) => ({
				pulpit: p.pulpit,
				pulpit_name: p.pulpit_name,
				faculty,
			}));

			await prisma.pulpits.createMany({
				data: pulpitData,
			});
		}

		return newFaculty;
	} catch (err: any) {
		throw new Error(`Failed to add faculty: ${err.message}`);
	}
}

export const updateFaculty = async (data: faculties) => {
	try {
		const faculty = await prisma.faculties.update({
			where: {
				faculty: data.faculty,
			},
			data,
		});

		return faculty;
	} catch (err: any) {
		throw new Error(`Failed to update faculty: ${err.message}`);
	}
}

export const deleteFaculty = async (faculty: string) => {
	try {
		const deletedFaculty = await prisma.faculties.delete({
			where: {
				faculty,
			},
		});

		return deletedFaculty;
	} catch (err: any) {
		throw new Error(`Failed to delete faculty: ${err.message}`);
	}
}

export const getSubjectsByFaculty = async (faculty: string) => {
	try {
		const facultyWithSubjects = await prisma.faculties.findUnique({
			where: { faculty: faculty },
		}).pulpits({
			select: {
				pulpit: true,
				subjects: {
					select: {
						subject_name: true
					}
				}
			}
		});

		return facultyWithSubjects;
	} catch (err: any) {
		throw new Error(`Failed to get subject by faculty: ${err.message}`);
	}
}

interface PulpitInput {
	pulpit: string;
	pulpit_name: string;
}

interface FacultyInput {
	faculty: string;
	faculty_name: string;
	pulpits?: PulpitInput[];
}