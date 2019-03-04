const axios = require('axios');

async function getTimes(url, limit) {
	const times = [];

	for(let i = 0; i < limit; i++) {
		const startTime = Date.now();

		await axios.get(url);

		const endTime = Date.now();

		times.push(endTime - startTime);
	}

	return times;
}

function analyseTimes(times) {
	return {
		average: times.reduce((a, b) => a + b) / times.length,
		min: Math.min(...times),
		max: Math.max(...times)
	};
}

(async () => {

	const yacdn = 'https://yacdn.org/proxy';
	const url = 'http://meowbaari.com/wp-content/uploads/2016/06/1464933654_cat_sleep.png';
	const hits = 10;

	const nativeTimes = await getTimes(url, hits);
	const native = analyseTimes(nativeTimes);

	console.log(`${url}`);
	console.log(`Took ${native.average}ms on average (min: ${native.min}ms, max: ${native.max}ms)\n`);

	const proxyTimes = await getTimes(url, hits);
	const proxy = analyseTimes(proxyTimes);

	console.log(`${yacdn}/${url}`);
	console.log(`Took ${proxy.average}ms on average (min: ${proxy.min}ms, max: ${proxy.max}ms)\n`);

})();
