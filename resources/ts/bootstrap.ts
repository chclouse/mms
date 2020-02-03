import jQuery from "jquery";
import { env } from "../../server/env";
import Vue from "vue";

/**
 * Use the exteral `window` variable
 */
declare var window: any;

declare global {
	interface Window {
		app: Vue
	}
}

/**
 * Setup the environment
 */
env.use(window.ENV);

/**
 * Setup jQuery
 */
window.$ = window.jQuery = jQuery;

/**
 * Load Vue components
 */
const files = require.context('./', true, /\.vue$/i);
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));
