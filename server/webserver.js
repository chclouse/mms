const express = require("express");
const path = require("path");
const mustache = require("mustache-express");
const app = express();

/**
 * The path to the views
 */
const VIEWS_PATH = `${__dirname}/../resources/views`;

module.exports = {
	serve(port, clientEnv = {}) {

		/**
		 * Create the template engine
		 */
		let engine = mustache(`${VIEWS_PATH}/partials`, ".mst");

		/**
		 * Use the Mustache template engine
		 */
		app.engine("mst", engine);

		/**
		 * Set up some parameters
		 */
		app.set("view engine", "mst");
		app.set("views", VIEWS_PATH);

		/**
		 * Allow fetching static resources
		 */
		app.use(express.static(path.join(`${__dirname}/../public`)));

		// Routing ---------------------------------------------------------------------------------

		/**
		 * Route to the game page
		 */
		app.get('/', function (req, res) {
			res.render('index', {ENV: JSON.stringify(clientEnv)});
		});

		/**
		 * Listen on the specified port
		 */
		app.listen(port);
	}
};
