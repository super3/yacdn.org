/* eslint curly: 0 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const request = require('request');
const Koa = require('koa');
const Router = require('koa-router');
const send = require('koa-send');
const axios = require('axios');

const app = new Koa();
const router = new Router();
const config = require('./config.js');

const download = util.promisify((uri, filename, callback) => {
	request.head(uri, (err, res) => {
		if (err) console.log(err);
		const type = res.headers['content-type'];
		const length = res.headers['content-length'];
		console.log(`Downloading: ${uri} (${type}, ${length} bytes)`);
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
});

const access = util.promisify(fs.access);

app.use(async (ctx, next) => {
	const servePath = '/serve/';

	if (!ctx.path.startsWith(servePath))
		return next();

	const url = ctx.path.slice(servePath.length);
	const {ext} = path.parse(url);

	const urlHash = crypto.createHash('sha256')
		.update(url)
		.digest('hex');

	const filePath = path.join(config.cacheDir, urlHash) + ext;

	try {
		await access(filePath);
	} catch (error) {
		await download(url, path.join(__dirname, filePath));
	}

	await send(ctx, filePath);
	console.log('Served: ' + url);
});

app.use(async ctx => {
	const servePath = '/proxy/';

	if (!ctx.path.startsWith(servePath))
		return;

	const url = ctx.path.slice(servePath.length) + '?' + ctx.querystring;

	console.log(url);

	const response = await axios.get(url, {
		responseType: 'stream'
	});

	ctx.set('Access-Control-Allow-Origin', '*');

	ctx.set('Content-Type', response.headers['content-type']);
	ctx.body = response.data;
});

app.use(router.routes());

// Start the server, if running this script alone
if (require.main === module) {
	/* istanbul ignore next */
	app.listen(3000, () => {
		console.log('Server listening on port 3000...');
	});
}

module.exports = app;
