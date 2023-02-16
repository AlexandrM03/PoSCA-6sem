import http from 'http';
import url from 'url';
import { Faculty, Pulpit, Subject, Teacher, Auditorium, AuditoriumType } from '../db.init.js';
import fs from 'fs';

const getFaculties = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	const faculties = await Faculty.findAll();
	res.end(JSON.stringify(faculties));
}

const getPulpits = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	const pulpits = await Pulpit.findAll();
	res.end(JSON.stringify(pulpits));
}

const getSubjects = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	const subjects = await Subject.findAll();
	res.end(JSON.stringify(subjects));
}

const getTeachers = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	const teachers = await Teacher.findAll();
	res.end(JSON.stringify(teachers));
}

const getAuditoriums = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	const auditoriums = await Auditorium.findAll();
	res.end(JSON.stringify(auditoriums));
}

const getAuditoriumsScope = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	const auditoriums = await Auditorium.scope('smallAuds').findAll();
	res.end(JSON.stringify(auditoriums));
}

const getAuditoriumTypes = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	const auditoriumType = await AuditoriumType.findAll();
	res.end(JSON.stringify(auditoriumType));
}

const getSubjectsByFaculty = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	const faculty = RegExp(/\/api\/faculties\/(.+)\/subjects/).exec(decodeURI(req.url!))![1];
	const faculty_subjects = await Faculty.findAll({
		where: { faculty },
		include: [{
			model: Pulpit,
			include: [{
				model: Subject
			}]
		}],
	});
	res.end(JSON.stringify(faculty_subjects));
}

const getAuditoriumsByAuditoriumType = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	const auditoriumType = RegExp(/\/api\/auditoriumtypes\/(.+)\/auditoriums/).exec(decodeURI(req.url!))![1];
	console.log(auditoriumType);
	const auditoriumType_auditoriums = await AuditoriumType.findAll({
		where: { auditorium_type: auditoriumType },
		include: [{
			model: Auditorium
		}],
	});
	res.end(JSON.stringify(auditoriumType_auditoriums));
}

const getFile = (req: http.IncomingMessage, res: http.ServerResponse) => {
	fs.readFile("./index.html", (err, data) => {
		if (err) {
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Not Found' }));
		} else {
			res.end(data);
		}
	})
}

export const handleGet = async (req: http.IncomingMessage, res: http.ServerResponse) => {
	const path = decodeURI(url.parse(req.url!).pathname!);
	switch (true) {
		case path === '/faculties':
			await getFaculties(req, res);
			break;
		case path === '/pulpits':
			await getPulpits(req, res);
			break;
		case path === '/subjects':
			await getSubjects(req, res);
			break;
		case path === '/teachers':
			await getTeachers(req, res);
			break;
		case path === '/auditoriums':
			await getAuditoriums(req, res);
			break;
		case path === '/auditoriumTypes':
			await getAuditoriumTypes(req, res);
			break;
		case RegExp(/\/api\/faculties\/(.+)\/subjects/).test(decodeURI(path)):
			await getSubjectsByFaculty(req, res);
			break;
		case RegExp(/\/api\/auditoriumtypes\/(.+)\/auditoriums/).test(decodeURI(path)):
			await getAuditoriumsByAuditoriumType(req, res);
			break;
		case path === '/scope':
			await getAuditoriumsScope(req, res);
			break;
		case path === '/':
			getFile(req, res);
			break;
		default:
			res.writeHead(404, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Not Found' }));
			break;
	}
}