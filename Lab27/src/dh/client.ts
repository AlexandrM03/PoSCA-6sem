import axios from 'axios';
import crypto from 'crypto';
import fs from 'fs';
import { ClientDH } from './client-dh.js';

(async () => {
	try {
		let res = await axios.get('http://localhost:3000/');

		const clientDH = new ClientDH(res.data)
		const clientContext = clientDH.getContext();
		const secret = clientDH.getSecret(res.data);

		res = await axios.post('http://localhost:3000/resource', { clientContext });
		const text = res.data;
		const decipher = crypto.createDecipher('aes256', secret.toString());
		const decrypted = decipher.update(text, 'hex', 'utf-8') + decipher.final('utf-8');
		fs.writeFileSync('./data/DHclient.txt', decrypted);
	} catch (err) {
		console.error(err);
	}
})();