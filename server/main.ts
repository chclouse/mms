import { Server } from "./core/server";
import WebServer from "./webserver";
import { env } from "./env";
import { Mms } from "./mms" ;

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
	 * Create the MMS instance
	 */
	let mms = new Mms(websocketPort);

	/**
	 * Boot MMS
	 */
	mms.boot();
}

main();
