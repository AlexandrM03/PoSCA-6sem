import redis from 'redis';

const main = async () => {
	const client = redis.createClient();

	client.on('error', err => {
		console.log('Error ' + err);
	});

	await client.connect();

	await client.publish('first_channel', 'message_1');
	await client.publish('first_channel', 'message_2');
	await client.publish('second_channel', 'message_3');

	await client.disconnect();
}

main();