import redis from 'redis';

const incr = async (client: redis.RedisClientType) => {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < 10000; i++) {
			client.incr('age');
		}
		resolve(client.get('age'));
	});
}

const decr = async (client: redis.RedisClientType) => {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < 10000; i++) {
			client.decr('age');
		}
		resolve(client.get('age'));
	});
}

const main = async () => {
	const client: redis.RedisClientType = redis.createClient();

	client.on('error', err => {
		console.log('Error ' + err);
	});
	await client.connect();
	console.log('Connected to Redis');

	let start = performance.now();
	const incrValue = await incr(client);
	let end = performance.now();
	console.log(`Incr time: ${end - start} ms, value: ${incrValue}`);

	start = performance.now();
	const decrValue = await decr(client);
	end = performance.now();
	console.log(`Decr time: ${end - start} ms, value: ${decrValue}`);

	await client.quit();
}

main();