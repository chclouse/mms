import Vue from "vue";
import Vuex from "vuex";
import createLogger from "vuex/dist/logger";
import app from "./modules/app";

/**
 * Use Vuex in Vue
 */
Vue.use(Vuex);

/**
 * Check if debugging should be enabled
 */
const debug = process.env.NODE_ENV !== "production";

/**
 * Create the store
 */
export default new Vuex.Store({
	modules: {
		app
	},
	strict: debug,
	plugins: debug ? [createLogger()] : []
});
