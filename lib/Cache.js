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
	constructor(path = config.cacheDir, name = 'cache') {
		this.path = path;
		this.name = name;
	}

	async clear() {
		await redis.del(`cache:${this.name}`);
		await redis.del(`cache-storage-usage`);
		await del(`${this.path}/*`);
	}

	async retrieve(url, maxAge = 24 * 60 * 60 * 1000) { /* returns stream */
		const hash = crypto.createHash('sha256')
			.update(url)
			.digest('hex');

		const filePath = path.join(this.path, hash) + '.bin';

		const created = Number(await redis.zscore(`cache:${this.name}`, hash));

		if (Date.now() - created > maxAge) {
			debug(url, 'not in cache');
			// file not in cache or too old

			try {
				// if exists delete it
				const {size} = await stat(filePath);

				await unlink(size);
				await redis.decrby(`cache-storage-usage`, size);
			} catch (err) {
				// file doesn't exist
			}

			const response = await axios.get(url, {
				responseType: 'stream'
			});

			const meta = {
				contentLength: response.headers['content-length'],
				contentType: response.headers['content-type']
			};

			const data = new stream.PassThrough();
			response.data.pipe(data);

			try {
				response.data.pipe(fs.createWriteStream(filePath));

				setTimeout(async () => {
					await writeFile(`${filePath}.json`, JSON.stringify(meta));

					await redis.zadd(`cache:${this.name}`, Date.now(), hash);
				}, 0);
			} catch (error) {
				// already writing too file
			}

			return {
				...meta,
				data
			};
		}

		debug(url, 'already in cache');

		const meta = JSON.parse(await readFile(`${filePath}.json`, 'utf8'));

		return {
			...meta,
			data: fs.createReadStream(filePath)
		};
	}

	async remove() {

	}
};
