import redis from 'redis';

const main = async () => {
	const client = redis.createClient();

	client.on('error', err => {
		console.log('Error ' + err);
	});

	await client.connect();

	await client.set('age', 10);
	const value = await client.get('age');
	console.log(value);

	await client.disconnect();
}

main();