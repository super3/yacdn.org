const assert = require('assert');
const axios = require('axios');

const testUrl = 'https://gist.githubusercontent.com/super3/06bec2ec29b7588728100df720a4b18d/raw/6cfc71b3f70d85429a737dc01b9441799fec14bd/gistfile1.txt';
const testResult = 'Hello World!';

const app = require('../server');

describe('yacdn', () => {
	before(done => {
		app.listen(3000, done);
	});

	describe('/serve', () => {
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
});
