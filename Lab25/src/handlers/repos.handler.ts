import { Router, Request, Response } from 'express';
import prisma from '../client/prisma.js';
import { Repos } from '../models/repos.model.js';
import { Commits } from '../models/commits.model.js';

export class ReposHandler {
	public router: Router;

	constructor() {
		this.router = Router();

		this.router.get('/', this.getAllRepos.bind(this));
		this.router.get('/:id', this.getOneRepo.bind(this));
		this.router.post('/', this.createRepo.bind(this));
		this.router.put('/:id', this.updateRepo.bind(this));
		this.router.delete('/:id', this.deleteRepo.bind(this));
		this.router.get('/:id/commits', this.getAllCommitsByRepo.bind(this));
		this.router.get('/:id/commits/:commitId', this.getOneCommitByRepo.bind(this));
		this.router.post('/:id/commits', this.createCommitByRepo.bind(this));
		this.router.put('/:id/commits/:commitId', this.updateCommitByRepo.bind(this));
		this.router.delete('/:id/commits/:commitId', this.deleteCommitByRepo.bind(this));
	}

	private async getAllRepos(req: Request, res: Response) {
		try {
			req.ability?.throwUnlessCan('read', 'Repos');
			const repos = await prisma.repos.findMany();
			res.status(200).json(repos);
		} catch (err) {
			res.status(403).send(err);
		}
	}

	private async getOneRepo(req: Request, res: Response) {
		try {
			const repo = await prisma.repos.findUnique({ where: { id: +req.params.id } });
			if (repo) {
				req.ability?.throwUnlessCan('read', new Repos(repo?.authorId));
				res.status(200).json(repo);
			} else {
				res.status(404).send('Not found');
			}
		} catch (err) {
			res.status(403).send(err);
		}
	}

	private async createRepo(req: Request, res: Response) {
		try {
			req.ability?.throwUnlessCan('create', 'Repos');
			const repo = await prisma.repos.create({
				data: {
					authorId: req.payload.id,
					name: req.body.name
				}
			});
			res.status(201).json(repo);
		} catch (err) {
			res.status(403).send(err);
		}
	}

	private async updateRepo(req: Request, res: Response) {
		try {
			const repo = await prisma.repos.findUnique({ where: { id: +req.params.id } });
			if (repo) {
				req.ability?.throwUnlessCan('update', new Repos(repo?.authorId));
				const repoUpd = await prisma.repos.update({
					where: { id: +req.params.id },
					data: {
						name: req.body.name
					}
				});
				res.status(200).json(repoUpd);
			} else {
				res.status(404).send('Not found');
			}
		} catch (err) {
			res.status(403).send(err);
		}
	}

	private async deleteRepo(req: Request, res: Response) {
		try {
			req.ability?.throwUnlessCan('manage', 'all');
			const repo = await prisma.repos.delete({ where: { id: +req.params.id } });
			if (repo) {
				res.status(200).json(repo);
			} else {
				res.status(404).send('Not found');
			}
		} catch (err) {
			res.status(403).send(err);
		}
	}

	private async getAllCommitsByRepo(req: Request, res: Response) {
		try {
			req.ability?.throwUnlessCan('read', 'Commits');
			const commits = await prisma.commits.findMany({
				where: {
					repoId: +req.params.id
				}
			});
			if (commits) {
				res.status(200).json(commits);
			} else {
				res.status(404).send('Not found');
			}
		} catch (err) {
			res.status(403).send(err);
		}
	}

	private async getOneCommitByRepo(req: Request, res: Response) {
		try {
			const commit = await prisma.commits.findUnique({ where: { id: +req.params.commitId } });
			if (commit) {
				const repo = await prisma.repos.findUnique({ where: { id: commit.repoId! } });
				req.ability?.throwUnlessCan('read', new Commits(repo?.authorId!));
				res.status(200).json(commit);
			} else {
				res.status(404).send('Not found');
			}
		} catch (err) {
			res.status(403).send(err);
		}
	}

	private async createCommitByRepo(req: Request, res: Response) {
		try {
			const repo = await prisma.repos.findUnique({ where: { id: +req.params.id } });
			if (repo) {
				req.ability?.throwUnlessCan('create', new Repos(repo?.authorId!));
				const commit = await prisma.commits.create({
					data: {
						message: req.body.message,
						repoId: +req.params.id,
					}
				});
				res.status(201).json(commit);
			} else {
				res.status(404).send('Not found');
			}
		} catch (err) {
			res.status(403).send(err);
		}
	}

	private async updateCommitByRepo(req: Request, res: Response) {
		try {
			const repo = await prisma.repos.findUnique({ where: { id: +req.params.id } });
			if (!repo) {
				res.status(404).send('Not found');
				return;
			}

			req.ability?.throwUnlessCan('update', new Repos(repo?.authorId!));
			const commit = await prisma.commits.update({
				where: { id: +req.params.commitId },
				data: {
					message: req.body.message
				}
			});
			if (commit) {
				res.status(200).json(commit);
			} else {
				res.status(404).send('Not found');
			}
		} catch (err) {
			res.status(403).send(err);
		}
	}

	private async deleteCommitByRepo(req: Request, res: Response) {
		try {
			req.ability?.throwUnlessCan('manage', 'all');
			const commit = await prisma.commits.delete({ where: { id: +req.params.commitId } });
			if (commit) {
				res.status(200).json(commit);
			} else {
				res.status(404).send('Not found');
			}
		} catch (err) {
			res.status(403).send(err);
		}
	}
}