import express, { Request } from 'express';
import casl from 'casl';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { AuthHandler } from './handlers/auth.handler.js';
import { UserHandler } from './handlers/user.handler.js';
import { ReposHandler } from './handlers/repos.handler.js';
import { AbilityHandler } from './handlers/ability.handler.js';

declare module 'express' {
	interface Request {
		payload?: any;
		ability?: casl.Ability;
	}
}

const PORT = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('secret'));

const accessKey = 'secret'

app.use((req: Request, res, next) => {
	const { rules, can, cannot } = casl.AbilityBuilder.extract();
	if (req.cookies.accessToken) {
		jwt.verify(req.cookies.accessToken, accessKey, (err: any, payload: any) => {
			if (err) {
				next();
			} else if (payload) {
				req.payload = payload;
				can(['read', 'create', 'update'], ['Repos', 'Commits'], { authorId: req.payload.id });
				can('read', 'UsersCASL', { id: req.payload.id });

				if (req.payload.role === 'admin') {
					cannot('create', ['Repos', 'Commits']);
					can('manage', 'all');
				}
			}
		});
	} else {
		req.payload = { id: 0 };
		can('read', ['Repos', 'Commits'], 'all');
	}

	req.ability = new casl.Ability(rules);
	next();
});

app.use('/', new AuthHandler().router);
app.use('/api/users', new UserHandler().router);
app.use('/api/repos', new ReposHandler().router);
app.use('/api/ability', new AbilityHandler().router);

app.use((req: Request, res, next) => {
	res.status(404).send('Not found');
});

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});