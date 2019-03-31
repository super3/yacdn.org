/* global jest, test, beforeAll */
const assert = require('assert');
const Cache = require('../lib/Cache');

const cache = new Cache(undefined, undefined, 20);

jest.setTimeout(10 * 1000);

const singleByteFileUrl = 'https://gist.githubusercontent.com/montyanderson/2a07b9ae6a24811720a8fc1d7d3eb20c/raw/338c471cae1e8ad780c2a15cf1f04cd357c40c3b/single-byte-file.txt';

const fiveByteFile = 'https://gist.githubusercontent.com/montyanderson/2a07b9ae6a24811720a8fc1d7d3eb20c/raw/d594d6d329717378f5d6abc8489741fb7b061f6f/five-byte-file.txt';

test('should store correct amount of items', async () => {
	const items = 20;

	for(let i = 0; i < items; i++) {
		console.log(i);
		await cache.retrieve(`${singleByteFileUrl}?${i}`);
	}

	await new Promise(resolve => setTimeout(resolve, 1000));

	assert.strictEqual(await cache.getItems(), items);
	assert.strictEqual(await cache.getStorageUsage(), items);
});

it('should delete the correct amount of items', async () => {
	await cache.retrieve(fiveByteFile);

	await new Promise(resolve => setTimeout(resolve, 1000));

	assert.strictEqual(await cache.getItems(), 16);
	assert.strictEqual(await cache.getStorageUsage(), 20);
});
