import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import { ServerDH } from './server-dh.js';
import bodyParser from 'body-parser';

const PORT = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let serverDH: ServerDH;

app.get('/', (req, res) => {
	serverDH = new ServerDH(1024, 3);
	res.send(serverDH.getContext());
});

app.post('/resource', (req, res) => {
	const clientContext = req.body.clientContext;
	if (!clientContext) {
		res.status(409).send('Client context not found');
		return;
	}

	const secret = serverDH.getSecret(clientContext);
	const cipher = crypto.createCipher('aes256', secret.toString());
	const file = fs.readFileSync('./data/DHserver.txt', 'utf-8');
	const encrypted = cipher.update(file, 'utf-8', 'hex') + cipher.final('hex');
	res.send(encrypted);
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});