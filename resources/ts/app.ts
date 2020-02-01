import "./bootstrap";
import { Client } from "./client";
import { env } from "../../server/env";

/**
 * Use the external window variable to access the environment variables
 */
let client = new Client(env("WEBSOCKET_HOST"), env.int("WEBSOCKET_PORT"));
client.connect();
console.log(client);

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
