import "./bootstrap";
import { env } from "../../server/env";
import Vue from "vue";
// import { Client } from "./client";

/**
 * Use the external window variable to access the environment variables
 */
// let client = new Client(env("WEBSOCKET_HOST"), env.int("WEBSOCKET_PORT"));
// client.connect();

/**
 * Create the Vue Application
 */
window.app = new Vue({
	el: "#app",
	methods: {
	}
});

// $("#join_form").submit(() => {
// 	try {
// 		let name = (<string>$("#username").val()).trim();
// 		if (name.length > 0) {
// 			client.join(name);
// 		}
// 	} catch (e) {
// 		console.error(e);
// 	}
// 	return false;
// });
