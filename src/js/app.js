import "./bootstrap";
import { Client } from "./client";

const PORT = 8763
const SERVERS = [
	"10.82.37.181",
	"10.82.36.172",
	"10.82.36.88",
	"127.0.0.1"
]

let client = new Client(SERVERS[2], PORT);

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
