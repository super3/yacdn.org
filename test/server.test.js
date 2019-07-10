/* global jest, test, beforeAll */
const fs = require('fs');
const assert = require('assert');
const axios = require('axios');
const Cache = require('../lib/Cache');

jest.setTimeout(1000 * 20);

const cache = new Cache();

const testUrl = 'https://gist.githubusercontent.com/super3/06bec2ec29b7588728100df720a4b18d/raw/6cfc71b3f70d85429a737dc01b9441799fec14bd/gistfile1.txt';
const testResult = 'Hello World!';

fs.writeFileSync(`${__dirname}/../blacklist.txt`, 'blacklist-test.net');

const app = require('../server');

beforeAll(async () =>
	new Promise(resolve => app.listen(3000, resolve))
);

test('/serve reject on blacklisted domain', async () => {
	try {
		await axios.get(`http://localhost:3000/serve/${testUrl}`, {
			headers: {
				Referer: 'https://blacklist-test.net/'
			}
		});
	} catch (error) {
		return;
	}

	throw new Error('Request didn\'t fail');
});

test('/ should redirect to Github', async () => {
	const response = await axios.get('http://localhost:3000/');

	assert.strictEqual(response.headers.server, 'GitHub.com');
});

test('/serve', async () => {
	await cache.clear();

	const {data} = await axios.get(`http://localhost:3000/serve/${testUrl}`);
	assert.strictEqual(data, testResult);
});

test('/serve', async () => {
	const {data} = await axios.get(`http://localhost:3000/serve/${testUrl}`);
	assert.strictEqual(data, testResult);
});

test('/serve cache locking', async () => {
	// wait for files to be older than 1s
	await new Promise(resolve => setTimeout(resolve, 1000));

	const promises = [];

	for (let i = 0; i < 20; i++) {
		promises.push((async () => {
			const {data} = await axios.get(`http://localhost:3000/serve/${testUrl}?maxAge=1`);
			assert.strictEqual(data, testResult);
		})());
	}

	await Promise.all(promises);
});

test('/serve', async () => {
	const {data} = await axios.get(`http://localhost:3000/serve/${testUrl}?maxAge=0`);
	assert.strictEqual(data, testResult);
});

test('/proxy', async () => {
	const {data} = await axios.get(`http://localhost:3000/proxy/${testUrl}`);
	assert.strictEqual(data, testResult);
});

test('/stats', async () => {
	const {data} = await axios.get('http://localhost:3000/stats');

	assert.strictEqual(typeof data, 'object');
	assert.strictEqual(typeof data.cdnHits, 'number');
	assert.strictEqual(typeof data.cdnData, 'string');
	assert.strictEqual(typeof data.cacheStorageUsage, 'string');
});

test('/nodes', async () => {
	const {data} = await axios.get('http://localhost:3000/nodes', {
		headers: {
			'x-forwarded-for': '51.15.124.253'
		}
	});

	assert.strictEqual(data[0].url, 'https://yacdn.org');
	assert(Number(data[0].distance) < 1);
});
