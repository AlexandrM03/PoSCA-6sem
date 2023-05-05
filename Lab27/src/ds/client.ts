import axios from 'axios';
import crypto from 'crypto';

const options = {
	baseURL: 'http://localhost:3000',
	url: '/student',
	method: 'get',
	headers: {
		'Accept': 'application/json'
	}
};

axios(options)
	.then((response) => {
		const { studentData, signature, publicKey } = response.data;

		const verify = crypto.createVerify('SHA256');
		verify.write(studentData);
		verify.end();
		const isValid = verify.verify(publicKey, signature, 'hex');

		console.log(`Student data: ${studentData}`);
		if (isValid) {
			console.log('Signature is valid: ', signature);
		} else {
			console.log('Invalid signature');
		}
	})
	.catch((error) => {
		console.error(error.message);
	});
