import { Server } from "./core/server";
import WebServer from "./webserver";
import { env } from "./env";

function main() {

	/**
	 * Load the .env file
	 */
	require("dotenv").config();

	/**
	 * Environment Variables
	 */
	let websocketHost: string = env("WEBSOCKET_HOST");
	let websocketPort: number = env.int("WEBSOCKET_PORT");
	let webserverPort: number = env.int("WEBSERVER_PORT");
	let websocketSecure: boolean = env.bool("WEBSOCKET_SECURE");

	/**
	 * Create the web server
	 */
	WebServer.serve(webserverPort, {
		WEBSOCKET_HOST:   websocketHost,
		WEBSOCKET_PORT:   websocketPort,
		WEBSOCKET_SECURE: websocketSecure
	});

	/**
	 * Create the web socket server
	 */
	let socketServer = new Server(websocketPort);
	socketServer.run();
}

main();
