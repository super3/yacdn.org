/* eslint curly: 0 */

const fs = require('fs');
const url = require('url');
const path = require('path');
const request = require('request');
const express = require('express');

const app = express();
const config = require('./config.js');

const download = function (uri, filename, callback) {
	request.head(uri, (err, res) => {
		if (err) console.log(err);
		console.log('content-type:', res.headers['content-type']);
		console.log('content-length:', res.headers['content-length']);
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};

app.get('/serve/:url', (req, res) => {
	const filename = path.basename(url.parse(req.params.url).pathname);
	download(req.params.url, config.cacheDir + filename, () => {
		console.log('done');
		res.sendFile(path.join(__dirname, config.cacheDir, filename));
	});
});

// Start the server, if running this script alone
if (require.main === module) {
	/* istanbul ignore next */
	app.listen(3000, () => {
		console.log('Server listening on port 3000...');
	});
}

module.exports = app;
