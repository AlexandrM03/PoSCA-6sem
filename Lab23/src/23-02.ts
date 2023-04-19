import express, { NextFunction, Response, Request } from 'express';
import bodyParser from 'body-parser';
import pkg from 'bluebird';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import redis from 'redis';
import User from './db/db.user.js';
import bcrypt from 'bcrypt';
import { db } from './db/db.connection.js';
import { generateAccessToken, generateRefreshToken } from './services/auth.service.js';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 3000;
const app = express();

const { promisifyAll } = pkg;
const redisClient = redis.createClient();
redisClient.connect();
promisifyAll(redisClient);

User.initialize(db);

let oldRefreshTokensCount = 0;

const jwtConfig = {
	tokens: {
		access: {
			type: 'access',
			expiresIn: '1m',
			secret: 'access-secret',
		},
		refresh: {
			type: 'refresh',
			expiresIn: '24h',
			secret: 'refresh-secret'
		}
	}
};

declare module 'express' {
	interface Request {
		payload?: any;
	}
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('secret'));
app.use((req: Request, res, next) => {
	if (req.cookies.accessToken) {
		jwt.verify(req.cookies.accessToken, jwtConfig.tokens.access.secret, (err: any, payload: any) => {
			if (err) {
				next();
			} else if (payload) {
				req.payload = payload;
				next();
			}
		});
	} else {
		next();
	}
});

app.get('/login', (req, res) => {
	res.sendFile(join(__dirname, 'public/login.html'));
});

app.post('/login', async (req, res) => {
	const candidate = await User.findOne({ where: { username: req.body.username } });
	if (!candidate) {
		return res.status(401).send('User not found');
	}

	if (!bcrypt.compareSync(req.body.password, candidate.dataValues.password)) {
		return res.status(401).send('Wrong password');
	}

	const accessToken = generateAccessToken(candidate.dataValues.id!, candidate.dataValues.username);
	const refreshToken = generateRefreshToken(candidate.dataValues.id!, candidate.dataValues.username);

	res.cookie('accessToken', accessToken, { httpOnly: true });
	res.cookie('refreshToken', refreshToken, { httpOnly: true });
	res.redirect('/resource');
});

app.get('/register', (req, res) => {
	res.sendFile(join(__dirname, 'public/register.html'));
});

app.post('/register', async (req, res) => {
	const candidate = await User.findOne({ where: { username: req.body.username } });
	if (candidate) {
		return res.status(409).send('User already exists');
	}

	console.log(req.body);

	const user = await User.create({
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password, 10)
	});

	res.redirect('/login');
});

app.get('/refresh-token', (req, res) => {
	if (req.cookies.refreshToken) {
		jwt.verify(req.cookies.refreshToken, jwtConfig.tokens.refresh.secret, async (err: any, payload: any) => {
			if (err || !payload) {
				return res.status(403).send('Refresh token is invalid');
			}

			redisClient.on('error', err => {
				console.log('Redis error: ' + err);
			})

			redisClient.set(oldRefreshTokensCount.toString(), req.cookies.refreshToken);
			oldRefreshTokensCount++;

			const candidate = await User.findOne({ where: { id: payload.id } });
			if (!candidate) {
				return res.status(401).send('User not found');
			}

			const accessToken = generateAccessToken(candidate.dataValues.id!, candidate.dataValues.username);
			const refreshToken = generateRefreshToken(candidate.dataValues.id!, candidate.dataValues.username);

			res.cookie('accessToken', accessToken, { httpOnly: true });
			res.cookie('refreshToken', refreshToken, { httpOnly: true });
			res.redirect('/resource');
		});
	}
});

app.get('/resource', (req: Request, res) => {
	if (req.payload) {
		res.send('Resource');
	} else {
		res.status(401).send('Unauthorized');
	}
});

app.get('/logout', (req, res) => {
	redisClient.set(oldRefreshTokensCount.toString(), req.cookies.refreshToken);
	oldRefreshTokensCount++;

	res.clearCookie('accessToken');
	res.clearCookie('refreshToken');
	res.redirect('/login');
});

app.get('/redis', async (req, res) => {
	let blackList = [];
	for (let i = 0; i < oldRefreshTokensCount; i++) {
		blackList.push(await redisClient.get(i.toString()));
	}

	res.send(blackList);
});

db.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
		return db.sync();
	})
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server started on port ${PORT}`);
		});
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
	});
