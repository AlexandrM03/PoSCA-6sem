import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import passport from './passports/digest.passport.js';

const app = express();
const port = 3000;

declare module 'express-session' {
	interface SessionData {
		authenticated: boolean;
	}
}

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', passport.authenticate('digest', { session: true }), (req: Request, res: Response) => {
	req.session.authenticated = true;
	res.send('Login success');
});

app.get('/logout', (req: Request, res: Response) => {
	req.session.authenticated = false;
	res.send('Logout success');
});

app.get('/resource', (req: Request, res: Response, next: NextFunction) => {
	if (req.session.authenticated) {
		next();
	} else {
		res.status(401).send('Unauthorized');
	}
}, (req: Request, res: Response) => {
	res.send('Resource');
});

app.use((req: Request, res: Response, next: NextFunction) => {
	res.status(404).send('Not found');
});

app.listen(port, () => {
	console.log(`Server started at http://localhost:${port}`);
});