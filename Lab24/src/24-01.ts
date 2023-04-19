import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import passport from './passports/github.passport.js';

const PORT = 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieSession({
	name: 'session',
	keys: ['key1', 'key2']
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
	res.send(`
		<a href="/auth/github">Login with Github</a>
	`);
});

app.get('/auth/github', passport.authenticate('github', {
	scope: ['user:email']
}));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
	res.redirect('/resource');
});

app.get('/logout', (req, res) => {
	req.logout(err => {
		if (err) {
			console.log(err);
		}
	});
	res.redirect('/login');
});

app.get('/resource', (req, res, next) => {
	if (req.isAuthenticated()) {
		next();
	} else {
		res.sendStatus(401);
	}
}, (req, res) => {
	res.send('Resource');
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});