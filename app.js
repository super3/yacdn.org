/* eslint curly: 0 */

const fs = require('fs');
const url = require('url');
const path = require('path');
const util = require('util');
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

router.get('/serve/:url', async ctx => {
	const filename = path.basename(url.parse(ctx.params.url).pathname);

	await download(ctx.params.url, config.cacheDir + filename);
	await send(ctx, path.join(config.cacheDir, filename));
	console.log('done');
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
