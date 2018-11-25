/* eslint curly: 0 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const crypto = require('crypto');
const request = require('request');
const Koa = require('koa');
const Router = require('koa-router');
const send = require('koa-send');

const app = new Koa();
const router = new Router();
const config = require('./config.js');

const download = util.promisify((uri, filename, callback) => {
	request.head(uri, (err, res) => {
		if (err) console.log(err);
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
});

const access = util.promisify(fs.access);

router.get('/serve/:url', async ctx => {
	const {ext} = path.parse(ctx.params.url);

	const fileHash = crypto.createHash('sha256')
		.update(ctx.params.url)
		.digest('hex');

	const filePath = path.join(config.cacheDir, fileHash) + ext;

	try {
		await access(filePath);
	} catch (err) {
		await download(ctx.params.url, path.join(__dirname, filePath));
	}

	await send(ctx, filePath);
	console.log('done');
});

app.use(router.routes());

// Start the server, if running this script alone
if (require.main === module) {
	/* istanbul ignore next */
	app.listen(80, () => {
		console.log('Server listening on port 80...');
	});
}

module.exports = app;
