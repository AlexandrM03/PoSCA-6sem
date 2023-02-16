import http from 'http';

export const handleError = (err: any, req: http.IncomingMessage, res: http.ServerResponse) => {
	res.setHeader('Content-Type', 'application/json');
	switch (err.name) {
		case 'SequelizeValidationError':
			res.statusCode = 400;
			res.end(JSON.stringify({ message: 'Validation Error' }));
			break;
		case 'SequelizeUniqueConstraintError':
			res.statusCode = 400;
			res.end(JSON.stringify({ message: 'Unique Constraint Error' }));
			break;
		case 'SequelizeDatabaseError':
			res.statusCode = 400;
			res.end(JSON.stringify({ message: 'Database Error' }));
			break;
		case 'SequelizeForeignKeyConstraintError':
			res.statusCode = 400;
			res.end(JSON.stringify({ message: 'Foreign Key Constraint Error' }));
			break;
		default:
			res.statusCode = 500;
			res.end(JSON.stringify({ message: 'Internal Server Error' }));
			break;
	}
}