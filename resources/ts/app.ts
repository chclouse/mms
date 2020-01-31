import "./bootstrap";
import { Client } from "./client";

/**
 * Use the external window variable to access the environment variables
 */
declare var window: any;

let client = new Client(window["ENV"].WEBSOCKET_HOST, window["ENV"].WEBSOCKET_PORT);
client.connect();

$("#join_form").submit(() => {
	try {
		let name = (<string>$("#username").val()).trim();
		if (name.length > 0) {
			client.join(name);
		}
	} catch (e) {
		console.error(e);
	}
	return false;
});
