import express from 'express';
import bodyParser from 'body-parser';

import facultyRouter from './controllers/faculty.controller.js';
import pulpitsRouter from './controllers/pulpits.controller.js';
import subjectRouter from './controllers/subject.controller.js';
import teacherRouter from './controllers/teacher.controller.js';
import auditoriumRouter from './controllers/auditorium.controller.js';
import auditoriumTypeRouter from './controllers/auditoriumType.controller.js';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/faculties', facultyRouter);
app.use('/api/pulpits', pulpitsRouter);
app.use('/api/subjects', subjectRouter);
app.use('/api/teachers', teacherRouter);
app.use('/api/auditoriums', auditoriumRouter);
app.use('/api/auditoriumtypes', auditoriumTypeRouter);
app.get('/', (req, res) => {
	res.sendFile('index.html', { root: './static' });
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});