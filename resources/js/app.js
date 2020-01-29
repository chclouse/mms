import "./bootstrap";
import { Client } from "./client";

const PORT = 8763
const SERVERS = [
	"127.0.0.1"
]

let client = new Client(SERVERS[0], PORT);

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
