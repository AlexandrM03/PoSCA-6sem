import { createClient } from 'webdav';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';

dotenv.config();

const client = createClient(process.env.WEBDAV_URL!, {
	username: process.env.WEBDAV_USERNAME!,
	password: process.env.WEBDAV_PASSWORD!
});

const filePath = './data/';
const downloadPath = './download/';

const app = express();
const PORT = process.env.PORT || 3000;

app.post('/md/:path', async (req, res) => {
	const path = '/' + req.params.path;
	try {
		if (await client.exists(path)) {
			res.status(408).send('Already exists');
		} else {
			await client.createDirectory(path);
			res.status(200).send('OK');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/rd/:path', async (req, res) => {
	const path = '/' + req.params.path;
	try {
		if (await client.exists(path)) {
			await client.deleteFile(path);
			res.status(200).send('OK');
		} else {
			res.status(404).send('Not found');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/up/:name', async (req, res) => {
	const file = filePath + req.params.name;
	try {
		if (await client.exists(file)) {
			await client.deleteFile(file);
		}

		const readStream = fs.createReadStream(file);
		if (await client.putFileContents(req.params.name, readStream)) {
			res.status(200).send('OK');
		} else {
			res.status(408).send('Not accepted');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/down/:name', async (req, res) => {
	const file = '/' + req.params.name;
	try {
		if (await client.exists(file)) {
			const downloadFilePath = downloadPath + file;
			const readStream = client.createReadStream(file);
			const writeStream = fs.createWriteStream(downloadFilePath);
			readStream.pipe(writeStream);
			res.status(200).send('OK');
		} else {
			res.status(404).send('Not found');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/del/:name', async (req, res) => {
	const file = '/' + req.params.name;
	try {
		if (await client.exists(file)) {
			await client.deleteFile(file);
			res.status(200).send('OK');
		} else {
			res.status(404).send('Not found');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/copy/:source/:destination', async (req, res) => {
	const sourcePath = '/' + req.params.source;
	const destinationPath = '/' + req.params.destination;

	try {
		if (await client.exists(sourcePath)) {
			await client.copyFile(sourcePath, destinationPath);
			res.status(200).send('OK');
		} else {
			res.status(404).send('Not found');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.post('/move/:source/:destination', async (req, res) => {
	const sourcePath = '/' + req.params.source;
	const destinationPath = '/' + req.params.destination;

	try {
		if (await client.exists(sourcePath)) {
			await client.moveFile(sourcePath, destinationPath);
			res.status(200).send('OK');
		} else {
			res.status(404).send('Not found');
		}
	} catch (err) {
		res.status(500).send(err);
	}
});

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});