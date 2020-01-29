const express = require('express');
const path = require("path");
const mustacheExpress = require("mustache-express");
const app = express();

module.exports = {
	serve(port) {

		/**
		 * Use the Mustache template engine
		 */
		app.engine("mustache", mustacheExpress());

		app.set("view engine", "mustache");
		app.set("views", __dirname + "/../resources/views");

		/**
		 * Allow fetching static resources
		 */
		app.use(express.static(path.join(`${__dirname}/../public`)));

		// Routing ---------------------------------------------------------------------------------

		/**
		 * Route to the game page
		 */
		app.get('/', function (req, res) {
			res.sendFile(path.join(`${__dirname}/../public/index.htm`));
		});

		/**
		 * Listen on the specified port
		 */
		app.listen(port);
	}
};
