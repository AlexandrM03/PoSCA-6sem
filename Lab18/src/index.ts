import http from 'http';
import { sequelize, Faculty, Pulpit, Teacher, Subject, Auditorium, AuditoriumType } from './db.init.js';
import { handleDelete } from './handlers/deleteHandler.js';
import { handleGet } from './handlers/getHandler.js';
import { handlePost } from './handlers/postHandler.js';
import { handlePut } from './handlers/putHandler.js';

const httpServer = http.createServer(async (req: http.IncomingMessage, res: http.ServerResponse) => {
	await sequelize.authenticate();
	await sequelize.sync();

	switch (req.method) {
		case 'GET':
			handleGet(req, res);
			break;
		case 'POST':
			handlePost(req, res);
			break;
		case 'PUT':
			handlePut(req, res);
			break;
		case 'DELETE':
			handleDelete(req, res);
			break;
		default:
			res.writeHead(405, { 'Content-Type': 'application/json' });
			res.end(JSON.stringify({ message: 'Method Not Allowed' }));
			break;
	}
});

httpServer.listen(3000, () => {
	console.log('Server is listening on port 3000');
});