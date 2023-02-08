import redis from 'redis';

const set = async (client: redis.RedisClientType) => {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < 10000; i++) {
			client.set(`n${i}`, `n${i}`);
		}
		resolve("done");
	});
}

const get = async (client: redis.RedisClientType) => {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < 10000; i++) {
			client.get(i.toString());
		}
		resolve("done");
	});
}

const del = async (client: redis.RedisClientType) => {
	return new Promise((resolve, reject) => {
		for (let i = 0; i < 10000; i++) {
			client.del(i.toString());
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
	await set(client);
	let end = performance.now();
	console.log(`Set time: ${end - start} ms`);

	start = performance.now();
	await get(client);
	end = performance.now();
	console.log(`Get time: ${end - start} ms`);

	start = performance.now();
	await del(client);
	end = performance.now();
	console.log(`Del time: ${end - start} ms`);

	await client.quit();
}

main();