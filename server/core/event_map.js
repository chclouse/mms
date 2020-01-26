class EventMap {

	/**
	 * Keep track of the proper context to reference the method
	 */
	_context = {};

	/**
	 * Create an event map
	 *
	 * @param {Context} context
	 * @param {JSON Object} map
	 */
	constructor(context, map) {
		this._context = context;
	}

	/**
	 * Handle a request
	 */
	handle(message, ...extra) {
		console.log(message);
		let req = JSON.parse(message);
		let func = "on" + req['id'][0].toUpperCase() + req['id'].substr(1);
		if (func in this._context && this._context[func] instanceof Function) {
			let args = (extra || []).concat(req['params'] || []);
			this._context[func].apply(this._context, args);
		} else {
			console.warn(`[Event Map], WARNING: attempt to invoke unknown event '${req['id']}' in '${this._context.constructor.name}'`);
		}
	}
}

module.exports = { EventMap };
