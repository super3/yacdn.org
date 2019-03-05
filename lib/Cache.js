const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const EventEmitter = require('events');
const axios = require('axios');

const redis = require('./redis');
const config = require('../config');

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

	async retrieve(url, maxAge = 24 * 60 * 60 * 1000) { /* returns stream */
		const hash = crypto.createHash('sha256')
			.update(url)
			.digest('hex');

		const filePath = path.join(this.path, hack) + ext;

		const created = await zscore(`cache:${this.name}`, hash)

		if(typeof created !== 'number' || Date.now() - created > maxAge) {
			// file not in cache or too old

			const {data} = await axios.get(url, {
				responseType: 'stream'
			});

			data.pipe(fs.createWriteStream(filePath));

			return data;
		} else {

		}
	}

	async remove() {

	}
};
