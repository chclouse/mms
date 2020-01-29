import "./bootstrap";
import { Client } from "./client";

let client = new Client(ENV.WEBSOCKET_HOST, ENV.WEBSOCKET_PORT);
client.connect();

$("#join_form").submit(() => {
	try {
		let name = $("#username").val().trim();
		if (name.length > 0) {
			client.join(name);
		}
	} catch (e) {
		console.error(e);
	}
	return false;
});
