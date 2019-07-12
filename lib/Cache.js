const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const stream = require('stream');
const axios = require('axios');
const debug = require('debug')('yacdn:cache');
const del = require('del');

const config = require('../config');
const redis = require('./redis');

const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const stat = util.promisify(fs.stat);
const unlink = util.promisify(fs.unlink);

/*
Cache#retrieve (url, maxAge = 1 day)
returns {
	size: Number,
	data: Stream,
	contentType: string
}
*/

module.exports = class Cache {
	constructor(path = config.cacheDir, name = 'cache', maxSize = config.cacheSize) {
		this.path = path;
		this.name = name;
		this.maxSize = maxSize;
	}

	async clear() {
		await redis.multi()
			.del(`cache:${this.name}`)
			.del(`cache-locks:${this.name}`)
			.del(`cache-last-used:${this.name}`)
			.del('cache-storage-usage')
			.exec();

		await del(`${this.path}/*.*`);
	}

	async retrieve(url, maxAge = 60 * 60 * 1000) { /* returns stream */
		const hash = crypto.createHash('sha256')
			.update(url)
			.digest('hex');

		const filePath = path.join(this.path, hash) + '.bin';

		const created = Number(await redis.zscore(`cache:${this.name}`, hash));
		const locked = await redis.sismember(`cache-locks:${this.name}`, hash);

		if ((Date.now() - created > maxAge) || locked) {
			debug(url, 'not in cache');
			debug('max age', maxAge);
			// file not in cache or too old

			const lock = maxAge > 0 && await redis.sadd(`cache-locks:${this.name}`, hash) === 1;

			debug('lock', lock);

			if (lock === true) {
				try {
					// if exists delete it
					const {size} = await stat(filePath);

					debug('deleting', filePath);

					await unlink(filePath);
					await redis.decrby('cache-storage-usage', size);
				} catch (error) {
					debug(filePath, 'not found');
				}
			}

			const response = await axios.get(url, {
				responseType: 'stream'
			});

			if (typeof response.headers['content-type'] !== 'string') {
				throw new TypeError('No Content-Type header given');
			}

			if (typeof response.headers['content-length'] !== 'string') {
				throw new TypeError('No Content-Length header given');
			}

			const meta = {
				contentLength: Number(response.headers['content-length']),
				contentType: response.headers['content-type']
			};

			const writeBuffer = new stream.PassThrough();
			const data = new stream.PassThrough();

			response.data.pipe(writeBuffer);
			response.data.pipe(data);

			let write = lock;

			if (lock === true) {
				// make space
				const storageUsage = await this.getStorageUsage();

				if ((storageUsage + meta.contentLength) > this.maxSize) {
					debug('making space');
					const overflow = (storageUsage + meta.contentLength) - this.maxSize;

					let i = 0;

					while (i < overflow) {
						const [hash] = await redis.zrangebyscore(`cache-last-used:${this.name}`, 0, '+inf', 'LIMIT', 0, 1);

						/* istanbul ignore next */
						if (typeof hash !== 'string') {
							write = false;

							break;
						}

						await redis.zrem(`cache-last-used:${this.name}`, hash);

						try {
							const filePath = path.join(this.path, hash) + '.bin';

							const {size} = await stat(filePath);

							debug('deleting to make space', filePath, size, i, overflow);

							await unlink(filePath);

							await redis.decrby('cache-storage-usage', size);
							await redis.zrem(`cache:${this.name}`, hash);

							i += size;
						} catch (error) {
							/* istanbul ignore next */
							debug('failed to delete file to make space', hash, overflow);
						}
					}
				}

				// write to file
				/* istanbul ignore next */ // ignore hard-to-replicate edge case
				if (write === true) {
					const writeStream = fs.createWriteStream(filePath);

					writeBuffer.pipe(writeStream);

					writeStream.on('close', async () => {
						debug('write stream ended');

						await writeFile(`${filePath}.json`, JSON.stringify(meta));

						await redis.multi()
							.zadd(`cache:${this.name}`, Date.now(), hash)
							.srem(`cache-locks:${this.name}`, hash)
							.incrby('cache-storage-usage', meta.contentLength)
							.exec();
					});
				}
			}

			await redis.zadd(`cache-last-used:${this.name}`, Date.now(), hash);

			return {
				...meta,
				data
			};
		}

		debug(url, 'already in cache');

		const meta = JSON.parse(await readFile(`${filePath}.json`, 'utf8'));

		await redis.zadd(`cache-last-used:${this.name}`, Date.now(), hash);

		return {
			...meta,
			data: fs.createReadStream(filePath)
		};
	}

	async getItems() {
		return Number(await redis.zcard(`cache:${this.name}`));
	}

	async getStorageUsage() {
		return Number(await redis.get('cache-storage-usage'));
	}

	async remove() {

	}
};
