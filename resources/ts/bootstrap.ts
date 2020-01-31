import jQuery from "jquery";
import { env } from "../../server/env";

/**
 * Use the exteral `window` variable
 */
declare var window: any;

/**
 * Setup jQuery
 */
window.$ = window.jQuery = jQuery;

/**
 * Setup the environment
 */
env.use(window.ENV);
