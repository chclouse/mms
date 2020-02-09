import "./bootstrap";
import Vue from "vue";
import store from "./store";

/**
 * Create the Vue Application
 */
let app = new Vue({
	el: "#app",
	store,
	mounted() {

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
