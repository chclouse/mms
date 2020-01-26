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
		let req = JSON.parse(message);
		if (req['id'] in this._context && this._context[req['id']] instanceof Function) {
			let args = (extra || []).concat(req['params'] || []);
			this._context[req['id']].apply(this._context, args);
		}
	}
}

module.exports = { EventMap };
