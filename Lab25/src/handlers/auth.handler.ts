import { Router, Request, Response } from 'express';
import * as fs from 'fs/promises';
import redis from 'redis';
import jwt from 'jsonwebtoken';
import prisma from '../client/prisma.js';

export class AuthHandler {
	public router: Router;

	private accessKey = 'secret';
	private refreshKey = 'secret';
	private redisClient = redis.createClient();
	private oldRefreshTokensCount = 0;

	constructor() {
		this.redisClient.connect();
		this.router = Router();

		this.router.get('/login', this.getLoginPage.bind(this));
		this.router.post('/login', this.login.bind(this));
		this.router.get('/register', this.getRegisterPage.bind(this));
		this.router.post('/register', this.register.bind(this));
		this.router.get('/resource', this.getResourcePage.bind(this));
		this.router.get('/refresh-token', this.refreshToken.bind(this));
		this.router.get('/logout', this.logout.bind(this));
	}

	private async getLoginPage(req: Request, res: Response) {
		const html = await fs.readFile('public/login.html', 'utf-8');
		res.send(html);
	}

	private async getRegisterPage(req: Request, res: Response) {
		const html = await fs.readFile('public/register.html', 'utf-8');
		res.send(html);
	}

	private async getResourcePage(req: Request, res: Response) {
		if (req.payload && req.payload.id !== 0) {
			res.status(200).send(`<h3>Resource page for user ${req.payload.id}-${req.payload.username} with role ${req.payload.role}</h3>`);
		} else {
			res.status(401).send('Unauthorized');
		}
	}

	private async refreshToken(req: Request, res: Response) {
		if (req.cookies.refreshToken) {
			jwt.verify(req.cookies.refreshToken, this.refreshKey, async (err: any, payload: any) => {
				if (err || !payload) {
					return res.status(403).send('Refresh token is invalid');
				}

				this.redisClient.on('error', err => {
					console.log('Redis error: ' + err);
				})

				this.redisClient.set(this.oldRefreshTokensCount.toString(), req.cookies.refreshToken);
				this.oldRefreshTokensCount++;

				const candidate = await prisma.users.findFirst({
					where: {
						id: payload.id
					}
				});

				if (candidate) {
					const accessToken = jwt.sign({
						id: candidate.id,
						username: candidate.username,
						role: candidate.role
					}, this.accessKey, { expiresIn: '1h' });

					const refreshToken = jwt.sign({
						id: candidate.id,
						username: candidate.username,
						role: candidate.role
					}, this.accessKey, { expiresIn: '1d' });

					res.cookie('accessToken', accessToken, { httpOnly: true });
					res.cookie('refreshToken', refreshToken, {
						httpOnly: true,
						path: '/refresh-token'
					});
					res.redirect('/resource');
				} else {
					res.status(403).send('User not found');
				}
			});
		}
	}

	private async logout(req: Request, res: Response) {
		res.clearCookie('accessToken');
		res.clearCookie('refreshToken');
		res.redirect('/login');
	}

	private async login(req: Request, res: Response) {
		const { username, password } = req.body;
		const candidate = await prisma.users.findFirst({
			where: {
				username,
				password
			}
		});

		if (!candidate) {
			res.redirect('/login');
		} else {
			const accessToken = jwt.sign({
				id: candidate.id,
				username: candidate.username,
				role: candidate.role
			}, this.accessKey, { expiresIn: '1h' });

			const refreshToken = jwt.sign({
				id: candidate.id,
				username: candidate.username,
				role: candidate.role
			}, this.accessKey, { expiresIn: '1d' });

			res.cookie('accessToken', accessToken, { httpOnly: true });
			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				path: '/refresh-token'
			});

			res.redirect('/resource');
		}
	}

	private async register(req: Request, res: Response) {
		const { username, password, role } = req.body;
		const candidate = await prisma.users.findFirst({
			where: {
				username
			}
		});

		if (candidate) {
			res.redirect('/register');
		} else {
			await prisma.users.create({
				data: {
					username,
					password,
					role
				}
			});

			res.redirect('/login');
		}
	}
}