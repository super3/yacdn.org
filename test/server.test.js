/* global test, beforeAll */
const assert = require('assert');
const axios = require('axios');

const del = require('del');

const testUrl = 'https://gist.githubusercontent.com/super3/06bec2ec29b7588728100df720a4b18d/raw/6cfc71b3f70d85429a737dc01b9441799fec14bd/gistfile1.txt';
const testResult = 'Hello World!';

const app = require('../server');

beforeAll(async () =>
	new Promise(resolve => app.listen(3000, resolve))
);

test('/ should redirect to Github', async () => {
	const response = await axios.get('http://localhost:3000/');

	assert.strictEqual(response.headers.server, 'GitHub.com');
});

test('/serve', async () => {
	await del(`${__dirname}/../cache/*.*`);

	const {data} = await axios.get(`http://localhost:3000/serve/${testUrl}`);
	assert.strictEqual(data, testResult);
});

test('/serve', async () => {
	const {data} = await axios.get(`http://localhost:3000/serve/${testUrl}`);
	assert.strictEqual(data, testResult);
});

test('/proxy', async () => {
	const {data} = await axios.get(`http://localhost:3000/proxy/${testUrl}`);
	assert.strictEqual(data, testResult);
});

describe('/stats', async () => {
	const {data} = await axios.get('http://localhost:3000/stats');

	assert.strictEqual(typeof data, 'object');
	assert.strictEqual(typeof data.cdnHits, 'number');
	assert.strictEqual(typeof data.cdnData, 'number');
	assert.strictEqual(typeof data.proxyHits, 'number');
	assert.strictEqual(typeof data.proxyData, 'number');
});
