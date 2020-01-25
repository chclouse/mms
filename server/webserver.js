const express = require('express');
const path = require("path");
const app = express();

module.exports = {
	serve(port) {
		app.use(express.static(path.join(`${__dirname}/../public`)));

		app.get('/', function (req, res) {
			res.sendFile(path.join(`${__dirname}/../public/index.htm`));
		});

		app.get('/.*', function (req, res) {
			res.send(req);
			// res.sendFile(path.join(`${__dirname}/../public/`))
		});

		app.listen(port);
	}
};
