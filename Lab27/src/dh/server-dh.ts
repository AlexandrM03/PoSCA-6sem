import crypto from 'crypto';
import { ClientDHContext } from './client-dh.js';

export class ServerDH {
	private dh: crypto.DiffieHellman;
	private prime: Buffer;
	private generator: Buffer;
	private keys: Buffer;

	constructor(prime: number, generator: number) {
		this.dh = crypto.createDiffieHellman(prime, generator);
		this.prime = this.dh.getPrime();
		this.generator = this.dh.getGenerator();
		this.keys = this.dh.generateKeys();
	}

	public getContext = (): ServerDHContext => {
		const context: ServerDHContext = {
			prime: this.prime.toString('hex'),
			generator: this.generator.toString('hex'),
			keys: this.keys.toString('hex')
		};
		return context;
	}

	public getSecret = (clientContext: ClientDHContext) => {
		return this.dh.computeSecret(Buffer.from(clientContext.keys, 'hex'));
	}
}

export interface ServerDHContext {
	prime: string;
	generator: string;
	keys: string;
}