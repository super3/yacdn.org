/* eslint curly: 0 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const Koa = require('koa');
const Router = require('koa-router');
const send = require('koa-send');
const axios = require('axios');
const redis = require('./lib/redis');

const app = new Koa();
const router = new Router();
const config = require('./config.js');

async function download(uri, filename) {
	const response = await axios.get(uri, {
		responseType: 'stream'
	});

	const type = response.headers['content-type'];
	const length = response.headers['content-length'];
	console.log(`Downloading: ${uri} (${type}, ${length} bytes)`);

	await redis.incrby('download', length);

	const stream = response.data.pipe(fs.createWriteStream(filename));

	await new Promise(resolve => stream.on('close', resolve));
}

const access = util.promisify(fs.access);
const stat = util.promisify(fs.stat);

app.use(async (ctx, next) => {
	if (ctx.path === '/')
		return ctx.redirect('https://ovsoinc.github.io/yacdn.org');

	await next();
});

app.use(async (ctx, next) => {
	const servePath = '/serve/';

	if (!ctx.path.startsWith(servePath))
		return next();

	await redis.incr('cdnhits');

	const url = ctx.path.slice(servePath.length);
	const {ext} = path.parse(url);

	// increment link counter
	await redis.zincrby('serveurls', 1, url);

	const urlHash = crypto.createHash('sha256')
		.update(url)
		.digest('hex');

	const filePath = path.join(config.cacheDir, urlHash) + ext;

	try {
		await access(filePath);
	} catch (error) {
		await download(url, path.join(__dirname, filePath));
	}

	const {size} = await stat(filePath);

	await redis.incrby('cdndata', size);

	await send(ctx, filePath);
	console.log('Served: ' + url);
});

app.use(async (ctx, next) => {
	const servePath = '/proxy/';

	if (!ctx.path.startsWith(servePath))
		return next();

	await redis.incr('proxyhits');

	const url = ctx.path.slice(servePath.length) + '?' + ctx.querystring;

	console.log(`Proxy: ${url}`);

	const response = await axios.get(url, {
		responseType: 'stream'
	});

	await redis.incrby('proxydata', response.headers['content-length']);

	ctx.set('Access-Control-Allow-Origin', '*');

	ctx.set('Content-Type', response.headers['content-type']);
	ctx.body = response.data;
});

app.use(async ctx => {
	const servePath = '/stats';

	/* istanbul ignore next */
	if (!ctx.path.startsWith(servePath))
		return;

	ctx.body = {
		cdnHits: Number(await redis.get('cdnhits')),
		cdnData: `${(Number(await redis.get('cdndata')) / Math.pow(1024, 3)).toFixed(2)} GB`,
		proxyHits: Number(await redis.get('proxyhits')),
		proxyData: `${(Number(await redis.get('proxydata')) / Math.pow(1024, 3)).toFixed(2)} GB`
	};
});

app.use(router.routes());

/* istanbul ignore next */
// Start the server, if running this script alone
if (require.main === module) {
	/* istanbul ignore next */
	app.listen(3000, () => {
		console.log('Server listening on port 3000...');
	});
}

module.exports = app;
