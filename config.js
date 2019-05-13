/* istanbul ignore file */

const ipstackKey = process.env.IPSTACK_KEY;

if (typeof ipstackKey !== 'string') {
	throw new TypeError('No ipstack key defined');
}

module.exports = {
	cacheDir: `${__dirname}/cache`,
	cacheSize: 5 * (1024 ** 3),
	ipstackKey
};
