const WebServer = require('./webserver');
const WebSocketServer = require('./core/server');

function main() {
	/**
	 * Load the local environment configuration
	 */
	require("dotenv").config();

	/**
	 * Fetch the environment
	 */
	let env = process.env;

	/**
	 * Create the web server
	 */
	WebServer.serve(parseInt(env["WEBSERVER_PORT"]), {
		WEBSOCKET_HOST:   env.WEBSOCKET_HOST,
		WEBSOCKET_PORT:   parseInt(env.WEBSOCKET_PORT),
		WEBSOCKET_SECURE: env.WEBSOCKET_SECURE.toLowerCase() == "true"
	});

	/**
	 * Create the web socket server
	 */
	socketServer = new WebSocketServer.Server(8763);
	socketServer.run();
}

main();
