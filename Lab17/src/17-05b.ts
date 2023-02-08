import redis from 'redis';

const main = async () => {
	const client = redis.createClient();

	client.on('error', err => {
		console.log('Error ' + err);
	});

	process.stdin.unref();
	process.stdin.on('data', async (data) => {
		if (data.toString().trim() === 'quit') {
			await client.disconnect();
		}
	});

	await client.connect();
	await client.subscribe('first_channel', (message, channel) => {
		console.log(`Message ${message} received from channel ${channel}`);
	});
}

main();