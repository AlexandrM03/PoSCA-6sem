import http from 'http';
import url from 'url';
import { DefaultDeserializer } from 'v8';
import { Faculty, Pulpit, Subject, Teacher, Auditorium, AuditoriumType } from '../db.init.js';
import { handleError } from './errorHandler.js';

const deleteFaculty = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	try {
		const faculty = RegExp(/\/faculties\/(.*)/).exec(decodeURI(req.url!))![1];
		const deletedFaculty = await Faculty.findByPk(faculty);
		await Faculty.destroy({
			where: {
				faculty
			}
		});
		res.end(JSON.stringify(deletedFaculty));
	} catch (err: any) {
		handleError(err, req, res);
	}
}

const deletePulpit = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	try {
		const pulpit = RegExp(/\/pulpits\/(.*)/).exec(decodeURI(req.url!))![1];
		const deletedPulpit = await Pulpit.findByPk(pulpit);
		await Pulpit.destroy({
			where: {
				pulpit
			}
		});
		res.end(JSON.stringify(deletedPulpit));
	} catch (err: any) {
		handleError(err, req, res);
	}
}

const deleteTeacher = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	try {
		const teacher = RegExp(/\/teachers\/(.*)/).exec(decodeURI(req.url!))![1];
		const deletedTeacher = await Teacher.findByPk(teacher);
		await Teacher.destroy({
			where: {
				teacher
			}
		});
		res.end(JSON.stringify(deletedTeacher));
	} catch (err: any) {
		handleError(err, req, res);
	}
}

const deleteSubject = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	try {
		const subject = RegExp(/\/subjects\/(.*)/).exec(decodeURI(req.url!))![1];
		const deletedSubject = await Subject.findByPk(subject);
		await Subject.destroy({
			where: {
				subject
			}
		});
		res.end(JSON.stringify(deletedSubject));
	} catch (err: any) {
		handleError(err, req, res);
	}
}

const deleteAuditorium = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	try {
		const auditorium = RegExp(/\/auditoriums\/(.*)/).exec(decodeURI(req.url!))![1];
		const deletedAuditorium = await Auditorium.findByPk(auditorium);
		await Auditorium.destroy({
			where: {
				auditorium
			}
		});
		res.end(JSON.stringify(deletedAuditorium));
	} catch (err: any) {
		handleError(err, req, res);
	}
}

const deleteAuditoriumType = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	try {
		const auditoriumType = RegExp(/\/auditoriumTypes\/(.*)/).exec(decodeURI(req.url!))![1];
		const deletedAuditoriumType = await AuditoriumType.findByPk(auditoriumType);
		await AuditoriumType.destroy({
			where: {
				auditorium_type: auditoriumType
			}
		});
		res.end(JSON.stringify(deletedAuditoriumType));
	} catch (err: any) {
		handleError(err, req, res);
	}
}

export const handleDelete = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	const path = decodeURI(url.parse(req.url!).pathname!);
	switch (true) {
		case RegExp(/\/faculties\/(.*)/).test(path):
			await deleteFaculty(req, res);
			break;
		case RegExp(/\/pulpits\/(.*)/).test(path):
			await deletePulpit(req, res);
			break;
		case RegExp(/\/teachers\/(.*)/).test(path):
			await deleteTeacher(req, res);
			break;
		case RegExp(/\/subjects\/(.*)/).test(path):
			await deleteSubject(req, res);
			break;
		case RegExp(/\/auditoriums\/(.*)/).test(path):
			await deleteAuditorium(req, res);
			break;
		case RegExp(/\/auditoriumTypes\/(.*)/).test(path):
			await deleteAuditoriumType(req, res);
			break;
		default:
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Not Found' }));
			break;
	}
}