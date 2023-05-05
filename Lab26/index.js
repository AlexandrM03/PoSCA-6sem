const https = require('https');
const fs = require('fs')

const options = {
	key: fs.readFileSync('LAB.key').toString(),
	cert: fs.readFileSync('Lab.crt').toString()
}

https.createServer(options, (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/html'
	});
	res.end('<h1>Https works</h1>');
}).listen(3000, () => {
	console.log('Server started at https://localhost:3000');
});