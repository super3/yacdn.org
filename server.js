/* eslint curly: 0 */
const Koa = require('koa');
const Router = require('koa-router');
const debug = require('debug')('yacdn:server');

const redis = require('./lib/redis');
const Cache = require('./lib/Cache');

const cache = new Cache();
const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
	if (ctx.path === '/')
		return ctx.redirect('https://ovsoinc.github.io/yacdn.org');

	await next();
});

app.use(async (ctx, next) => {
	const startTime = Date.now();

	const servePath = '/serve/';
	const proxyPath = '/proxy/';

	if ((!ctx.path.startsWith(servePath)) && (!ctx.path.startsWith(proxyPath))) {
		return next();
	}

	const route = ctx.path.startsWith(servePath) ? 'serve' : 'proxy';

	const n = await redis.incr('cdnhits');

	const url = `${ctx.path.slice(servePath.length)}?${route === 'proxy' ? ctx.querystring : ''}`;

	debug(`serve#${n} url: ${url}`);
	debug(`serve#${n} referer: ${ctx.request.headers.referer}`);

	// increment link counter
	await redis.zincrby('serveurls', 1, url);

	const defaultMaxAge = route === 'serve' ? 24 * 60 * 60 * 1000 : 0;
	const maxAge = route === 'serve' && typeof ctx.query.maxAge === 'string' ? Number(ctx.query.maxAge) * 1000 : defaultMaxAge;

	const {
		contentLength,
		contentType,
		data
	} = await cache.retrieve(url, maxAge);

	debug(`serve#${n} size: ${(contentLength / (1024 ** 2)).toFixed(2)} MB`);

	ctx.set('Access-Control-Allow-Origin', '*');
	ctx.set('Content-Length', contentLength);
	ctx.set('Content-Type', contentType);
	ctx.body = data;

	await redis.incrby('cdndata', contentLength);

	const time = Date.now() - startTime;
	const speed = contentLength / (time / 1000);

	// await new Promise(resolve => data.once('end', resolve));

	debug(`serve#${n} done, took ${time}ms`);
	debug(`serve#${n} effective speed: ${(speed / (10 ** 6)).toFixed(2)} megabits/s`);
});

app.use(async ctx => {
	const servePath = '/stats';

	/* istanbul ignore next */
	if (!ctx.path.startsWith(servePath))
		return;

	ctx.body = {
		cdnHits: Number(await redis.get('cdnhits')),
		cdnData: `${(Number(await redis.get('cdndata')) / (1024 ** 3)).toFixed(2)} GB`,
		cacheStorageUsage: `${(Number(await redis.get('cache-storage-usage')) / (1024 ** 3)).toFixed(2)} GB`
	};
});

app.use(router.routes());

/* istanbul ignore next */
// Start the server, if running this script alone
if (require.main === module) {
	/* istanbul ignore next */
	app.listen(3000, () => {
		debug('Server listening on port 3000...');
	});
}

module.exports = app;
