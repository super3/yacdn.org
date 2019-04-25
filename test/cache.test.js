/* global jest, test */
const fs = require('fs');
const assert = require('assert');
const Cache = require('../lib/Cache');

const cache = new Cache(undefined, undefined, 20);

jest.setTimeout(1000 * 20);

const singleByteFileUrl = 'https://gist.githubusercontent.com/montyanderson/2a07b9ae6a24811720a8fc1d7d3eb20c/raw/338c471cae1e8ad780c2a15cf1f04cd357c40c3b/single-byte-file.txt';

const fiveByteFile = 'https://gist.githubusercontent.com/montyanderson/2a07b9ae6a24811720a8fc1d7d3eb20c/raw/d594d6d329717378f5d6abc8489741fb7b061f6f/five-byte-file.txt';

test('should store correct amount of items', async () => {
	await cache.clear();

	const items = 20;

	for (let i = 0; i < items; i++) {
		console.log(i);
		await cache.retrieve(`${singleByteFileUrl}?${i}`);
		await new Promise(resolve => setTimeout(resolve, 100));
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

it('should handle race conditions properly', async () => {
	await cache.clear();

	await Promise.all([
		cache.retrieve(`${fiveByteFile}?1`),
		cache.retrieve(`${fiveByteFile}?2`),
		cache.retrieve(`${fiveByteFile}?3`),
		cache.retrieve(`${fiveByteFile}?4`)
	]);

	await new Promise(resolve => setTimeout(resolve, 1000));

	assert.strictEqual(await cache.getItems(), 4);
	assert.strictEqual(await cache.getStorageUsage(), 20);
});

it('should handle already open files', async () => {
	await cache.clear();

	fs.createWriteStream(`${__dirname}/../cache/471624bbbd71e1a5783e5cdfcdb96ba302f8b7de0df609c42bd7e0d1ee1456f7.bin`);

	await new Promise(resolve => setTimeout(resolve, 1000));

	await cache.retrieve(fiveByteFile);
});
