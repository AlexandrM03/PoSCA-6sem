import redis from 'redis';

const hset = async (client: redis.RedisClientType) => {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < 10000; i++) {
			client.hSet(`${i}`, i, JSON.stringify({ id: i, val: `value - ${i}` }));
		}
		resolve("done");
	});
}

const hget = async (client: redis.RedisClientType) => {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < 10000; i++) {
			client.hGetAll(`${i}`);
		}
		resolve("done");
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
	await hset(client);
	let end = performance.now();
	console.log(`Set time: ${end - start} ms`);

	start = performance.now();
	await hget(client);
	end = performance.now();
	console.log(`Get time: ${end - start} ms`);

	await client.quit();
}

main();