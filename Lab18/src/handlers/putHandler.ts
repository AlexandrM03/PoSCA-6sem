import http from 'http';
import { Sequelize, Transaction } from 'sequelize';
import { Faculty, Pulpit, Subject, Teacher, Auditorium, AuditoriumType, sequelize } from '../db.init.js';
import { handleError } from './errorHandler.js';

const updateFaculty = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const faculty = JSON.parse(data.toString());
			await Faculty.update({
				faculty_name: faculty.faculty_name
			}, {
				where: { faculty: faculty.faculty }
			});
			const updatedFaculty = await Faculty.findOne({
				where: { faculty: faculty.faculty }
			});
			res.end(JSON.stringify(updatedFaculty));
		} catch (err: any) {
			handleError(err, req, res)
		}
	});
}

const updatePulpit = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const pulpit = JSON.parse(data.toString());
			await Pulpit.update({
				pulpit_name: pulpit.pulpit_name,
				faculty: pulpit.faculty_name
			}, {
				where: { pulpit: pulpit.pulpit }
			});
			const updatedPulpit = await Pulpit.findOne({
				where: { pulpit: pulpit.pulpit }
			});
			res.end(JSON.stringify(updatedPulpit));
		} catch (err: any) {
			handleError(err, req, res)
		}
	});
}

const updateTeacher = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const teacher = JSON.parse(data.toString());
			await Teacher.update({
				teacher_name: teacher.teacher_name,
				pulpit: teacher.pulpit
			}, {
				where: { teacher: teacher.teacher }
			});
			const updatedTeacher = await Teacher.findOne({
				where: { teacher: teacher.teacher }
			});
			res.end(JSON.stringify(updatedTeacher));
		} catch (err: any) {
			handleError(err, req, res)
		}
	});
}

const updateSubject = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const subject = JSON.parse(data.toString());
			await Subject.update({
				subject_name: subject.subject_name,
				pulpit: subject.pulpit
			}, {
				where: { subject: subject.subject }
			});
			const updatedSubject = await Subject.findOne({
				where: { subject: subject.subject }
			});
			res.end(JSON.stringify(updatedSubject));
		} catch (err: any) {
			handleError(err, req, res)
		}
	});
}

const updateAuditorium = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const auditorium = JSON.parse(data.toString());
			await Auditorium.update({
				auditorium_name: auditorium.auditorium_name,
				auditorium_capacity: auditorium.auditorium_capacity,
				auditorium_type: auditorium.addAuditorium_type
			}, {
				where: { auditorium: auditorium.auditorium }
			});
			const updatedAuditorium = await Auditorium.findOne({
				where: { auditorium: auditorium.auditorium }
			});
			res.end(JSON.stringify(updatedAuditorium));
		} catch (err: any) {
			handleError(err, req, res)
		}
	});
}

const updateAuditoriumType = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const auditoriumType = JSON.parse(data.toString());
			await AuditoriumType.update({
				auditorium_typename: auditoriumType.auditorium_typename
			}, {
				where: { auditorium_type: auditoriumType.auditorium_type }
			});
			const updatedAuditoriumType = await AuditoriumType.findOne({
				where: { auditorium_type: auditoriumType.auditorium_type }
			});
			res.end(JSON.stringify(updatedAuditoriumType));
		} catch (err: any) {
			handleError(err, req, res);
		}
	});
}

const transactAuditoriums = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	try {
		const transaction = await sequelize.transaction({ isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED });
		await Auditorium.update({
			auditorium_capacity: 0
		}, {
			where: {},
			transaction
		});

		setTimeout(async () => {
			await transaction.rollback();
			console.log('Transaction rolled back');
		}, 10000);

		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ message: 'Transaction started' }));
	} catch (err: any) {
		handleError(err, req, res);
	}
}

export const handlePut = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	switch (true) {
		case req.url === '/faculties':
			await updateFaculty(req, res);
			break;
		case req.url === '/pulpits':
			await updatePulpit(req, res);
			break;
		case req.url === '/teachers':
			await updateTeacher(req, res);
			break;
		case req.url === '/subjects':
			await updateSubject(req, res);
			break;
		case req.url === '/auditoriums':
			await updateAuditorium(req, res);
			break;
		case req.url === '/auditoriumTypes':
			await updateAuditoriumType(req, res);
			break;
		case req.url === '/transaction':
			await transactAuditoriums(req, res);
			break;
		default:
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Not Found' }));
			break;
	}
}