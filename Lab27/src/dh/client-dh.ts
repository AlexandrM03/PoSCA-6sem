import crypto from 'crypto';
import { ServerDHContext } from './server-dh.js';

export class ClientDH {
	private dh: crypto.DiffieHellman;
	private prime: Buffer;
	private generator: Buffer;
	private keys: Buffer;

	constructor(serverContext: ServerDHContext) {
		this.prime = Buffer.from(serverContext.prime, 'hex');
		this.generator = Buffer.from(serverContext.generator, 'hex');
		this.dh = crypto.createDiffieHellman(this.prime, this.generator);
		this.keys = this.dh.generateKeys();
	}

	public getContext = (): ClientDHContext => {
		const context: ClientDHContext = {
			prime: this.prime.toString('hex'),
			generator: this.generator.toString('hex'),
			keys: this.keys.toString('hex')
		};
		return context;
	}

	public getSecret = (serverContext: ServerDHContext) => {
		return this.dh.computeSecret(Buffer.from(serverContext.keys, 'hex'));
	}
}

export interface ClientDHContext {
	prime: string;
	generator: string;
	keys: string;
}