const assert = require('assert');
const axios = require('axios');
const del = require('del');

const testUrl = 'https://gist.githubusercontent.com/super3/06bec2ec29b7588728100df720a4b18d/raw/6cfc71b3f70d85429a737dc01b9441799fec14bd/gistfile1.txt';
const testResult = 'Hello World!';

const app = require('../server');

describe('yacdn', () => {
	before(done => {
		app.listen(3000, done);
	});

	describe('/', () => {

	});

	describe('/serve', () => {
		it('should serve correct data', async () => {
			await del(`${__dirname}/../cache/*.*`);

			const {data} = await axios.get(`http://localhost:3000/serve/${testUrl}`);
			assert.strictEqual(data, testResult);
		});

		it('should serve correct data', async () => {
			const {data} = await axios.get(`http://localhost:3000/serve/${testUrl}`);
			assert.strictEqual(data, testResult);
		});
	});

	describe('/proxy', () => {
		it('should proxy correct data', async () => {
			const {data} = await axios.get(`http://localhost:3000/proxy/${testUrl}`);
			assert.strictEqual(data, testResult);
		});
	});

	describe('/stats', () => {
		it('should return data of correct types', async () => {
			const {data} = await axios.get('http://localhost:3000/stats');

			assert.strictEqual(typeof data, 'object');
			assert.strictEqual(typeof data.cdnHits, 'number');
			assert.strictEqual(typeof data.cdnData, 'number');
			assert.strictEqual(typeof data.proxyHits, 'number');
			assert.strictEqual(typeof data.proxyData, 'number');
		});
	});
});
