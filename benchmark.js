const axios = require('axios');

async function getTimes(url, limit) {
	const times = [];

	for (let i = 0; i < limit; i++) {
		const startTime = Date.now();

		await axios.get(url);

		const endTime = Date.now();

		times.push(endTime - startTime);
	}

	return times;
}

function analyseTimes(times) {
	return {
		average: Math.round(times.reduce((a, b) => a + b) / times.length),
		min: Math.min(...times),
		max: Math.max(...times)
	};
}

(async () => {
	const yacdn = 'https://yacdn.org';
	const url = process.argv.length > 2 ? process.argv[2] : 'http://meowbaari.com/wp-content/uploads/2016/06/1464933654_cat_sleep.png';
	const hits = 15;

	const nativeUrl = url;
	const nativeTimes = await getTimes(nativeUrl, hits);
	const native = analyseTimes(nativeTimes);

	console.log(nativeUrl);
	console.log(`Took ${native.average}ms on average (min: ${native.min}ms, max: ${native.max}ms)\n`);

	const proxyUrl = `${yacdn}/proxy/${url}`;
	const proxyTimes = await getTimes(proxyUrl, hits);
	const proxy = analyseTimes(proxyTimes);

	console.log(proxyUrl);
	console.log(`Took ${proxy.average}ms on average (min: ${proxy.min}ms, max: ${proxy.max}ms)\n`);

	const serveUrl = `${yacdn}/serve/${url}`;
	const serveTimes = await getTimes(serveUrl, hits);
	const serve = analyseTimes(serveTimes);

	console.log(serveUrl);
	console.log(`Took ${serve.average}ms on average (min: ${serve.min}ms, max: ${serve.max}ms)\n`);

	const proxySpeedIncrease = 100 * (1 - (proxy.average / native.average));
	console.log(`yacdn proxy is ${proxySpeedIncrease.toFixed(2)}% ${proxySpeedIncrease < 0 ? 'slower' : 'faster'}`);

	const serveSpeedIncrease = 100 * (1 - (serve.average / native.average));
	console.log(`yacdn serve is ${serveSpeedIncrease.toFixed(2)}% ${serveSpeedIncrease < 0 ? 'slower' : 'faster'}`);
})();
