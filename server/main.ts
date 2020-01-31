import { Server } from "./core/server";
import WebServer from "./webserver";

function main() {
	/**
	 * Load the local environment configuration
	 */
	require("dotenv").config();

	/**
	 * Environment Variables
	 */
	let websocketHost: string = <string>process.env["WEBSOCKET_HOST"];
	let websocketPort: number = parseInt(<string>process.env["WEBSOCKET_PORT"]);
	let webserverPort: number = parseInt(<string>process.env["WEBSERVER_PORT"]);
	let websocketSecure: boolean = (process.env["WEBSOCKET_SECURE"] || "").toLowerCase() == "true";

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
