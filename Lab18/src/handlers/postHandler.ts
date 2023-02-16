import http from 'http';
import { Faculty, Pulpit, Subject, Teacher, Auditorium, AuditoriumType } from '../db.init.js';
import { handleError } from './errorHandler.js';

const addFaculty = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const faculty = JSON.parse(data.toString());
			const insertedFaculty = await Faculty.create(faculty);
			res.end(JSON.stringify(insertedFaculty));
		} catch (err: any) {
			handleError(err, req, res)
		}
	});

}

const addPulpit = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const pulpit = JSON.parse(data.toString());
			const insertedPulpit = await Pulpit.create(pulpit);
			res.end(JSON.stringify(insertedPulpit));
		} catch (err: any) {
			handleError(err, req, res)
		}
	});
}

const addSubject = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const subject = JSON.parse(data.toString());
			const insertedSubject = await Subject.create(subject);
			res.end(JSON.stringify(insertedSubject));
		} catch (err: any) {
			handleError(err, req, res)
		}
	});
}

const addTeacher = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const teacher = JSON.parse(data.toString());
			const insertedTeacher = await Teacher.create(teacher);
			res.end(JSON.stringify(insertedTeacher));
		} catch (err: any) {
			handleError(err, req, res)
		}
	});
}

const addAuditorium = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const auditorium = JSON.parse(data.toString());
			const insertedAuditorium = await Auditorium.create(auditorium);
			res.end(JSON.stringify(insertedAuditorium));
		} catch (err: any) {
			handleError(err, req, res)
		}
	});
}

const addAuditoriumType = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	req.on('data', async (data) => {
		try {
			const auditoriumType = JSON.parse(data.toString());
			const insertedAuditoriumType = await AuditoriumType.create(auditoriumType);
			res.end(JSON.stringify(insertedAuditoriumType));
		} catch (err: any) {
			handleError(err, req, res)
		}
	});
}

export const handlePost = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	switch (true) {
		case req.url === '/faculties':
			await addFaculty(req, res);
			break;
		case req.url === '/pulpits':
			await addPulpit(req, res);
			break;
		case req.url === '/subjects':
			await addSubject(req, res);
			break;
		case req.url === '/teachers':
			await addTeacher(req, res);
			break;
		case req.url === '/auditoriums':
			await addAuditorium(req, res);
			break;
		case req.url === '/auditoriumTypes':
			await addAuditoriumType(req, res);
			break;
		default:
			res.writeHead(404, { 'Content-Type': 'text/plain' });
			res.end('Not found');
			break;
	}
}