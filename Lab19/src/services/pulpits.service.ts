import prisma from '../client/prisma.js';
import { pulpits } from '@prisma/client';
import { group } from 'console';

export const getPulpits = async () => {
	const pulpits = await prisma.pulpits.findMany();
	return pulpits;
}

export const createPulpit = async (data: PulpitInput) => {
	let { pulpit, pulpit_name, faculty } = data;

	try {
		const existingFaculty = await prisma.faculties.findUnique({
			where: {
				faculty
			}
		});

		if (!existingFaculty) {
			const [newFacultyCode, newFacultyName] = faculty.split(', ');
			await prisma.faculties.create({
				data: { faculty: newFacultyCode, faculty_name: newFacultyName },
			});
			faculty = newFacultyCode;
		}

		const newPulpit = await prisma.pulpits.create({
			data: {
				pulpit,
				pulpit_name,
				faculty,
			},
		});

		return newPulpit;
	} catch (err: any) {
		throw new Error(`Failed to add pulpit: ${err.message}`);
	}
}

export const updatePulpit = async (data: pulpits) => {
	try {
		const pulpit = await prisma.pulpits.update({
			where: {
				pulpit: data.pulpit,
			},
			data,
		});

		return pulpit;
	} catch (err: any) {
		throw new Error(`Failed to update pulpit: ${err.message}`);
	}
}

export const deletePulpit = async (pulpit: string) => {
	try {
		const deletedPulpit = await prisma.pulpits.delete({
			where: {
				pulpit,
			},
		});

		return deletedPulpit;
	} catch (err: any) {
		throw new Error(`Failed to delete pulpit: ${err.message}`);
	}
}

export const getPulpitsWithoutTeachers = async () => {
	try {
		const pulpits = await prisma.pulpits.findMany({
			where: {
				teachers: {
					none: {}
				},
			},
		});

		return pulpits;
	} catch (err: any) {
		throw new Error(`Failed to get pulpits without teachers: ${err.message}`);
	}
}

export const getPulpitsWithVladimir = async () => {
	try {
		const pulpitNamesWithVladimir = await prisma.pulpits.findMany({
			where: {
				teachers: {
					some: {
						teacher_name: {
							contains: 'Владимир'
						}
					}
				}
			},
			select: {
				pulpit_name: true
			}
		});

		return pulpitNamesWithVladimir;
	} catch (err: any) {
		throw new Error(`Failed to get pulpits with Vladimir: ${err.message}`);
	}
}

export const getPulpitsWithTeachersCountPagination = async (pageNumber: number) => {
	try {
		const pageSize = 5;
		const offset = (pageNumber - 1) * pageSize;

		const pulpitCounts = await prisma.$queryRaw`
			SELECT
  			  	p.pulpit_name,
  			  	(SELECT COUNT(*) FROM teachers t WHERE t.pulpit = p.pulpit) AS teacher_count
  			FROM
  			  	pulpits p
  			ORDER BY
  			  	p.pulpit_name
  			OFFSET ${offset} ROWS
  			FETCH NEXT ${pageSize} ROWS ONLY;
		`;

		return pulpitCounts;
	} catch (err: any) {
		throw new Error(`Failed to get pulpits with teachers count: ${err.message}`);
	}
}

interface PulpitInput {
	pulpit: string;
	pulpit_name: string;
	faculty: string;
}