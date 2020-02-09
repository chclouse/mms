import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import createLogger from "vuex/dist/logger";
import modules from "./modules";
import { IRootState } from "./states";
import { Client } from "../client";
import { env } from "../../../server/env";

/**
 * Use Vuex in Vue
 */
Vue.use(Vuex);

/**
 * Check if debugging should be enabled
 */
const debug = process.env.NODE_ENV !== "production";


const store: StoreOptions<IRootState> = {
	state: {
		connection: new Client(env("WEBSOCKET_HOST"), env.int("WEBSOCKET_PORT"))
	},
	modules,
	strict: debug,
	plugins: debug ? [createLogger()] : []
}

/**
 * Create the store
 */
export default new Vuex.Store<IRootState>(store);
