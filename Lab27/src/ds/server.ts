import express, { Request, Response } from 'express';
import fs from 'fs';
import crypto from 'crypto';

const app = express();
const PORT = 3000;

const studentData = fs.readFileSync('./data/DSserver.txt', 'utf8');

const sign = crypto.createSign('SHA256');
sign.write(studentData);
sign.end();
const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
	modulusLength: 2048,
	publicKeyEncoding: { type: "pkcs1", format: "pem" },
	privateKeyEncoding: { type: "pkcs1", format: "pem" },
});

const signature = sign.sign(privateKey, 'hex');

app.get('/student', (req: Request, res: Response) => {
	if (req.headers['accept'] !== 'application/json') {
		res.status(409).send('Invalid request');
		return;
	}

	res.json({ studentData, signature, publicKey });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
