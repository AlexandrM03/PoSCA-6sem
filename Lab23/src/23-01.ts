import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from './passports/form.passport.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
	resave: false,
	saveUninitialized: false,
	secret: 'secret'
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
	res.sendFile(join(__dirname, 'public/login.html'));
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/resource',
	failureRedirect: '/login'
}));

app.get('/resource', (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/login');
}, (req, res) => {
	res.send('Resource');
});

app.get('/logout', (req, res) => {
	req.logout(err => {
		if (err) {
			console.error(err);
		}
	});
	res.redirect('/login');
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});