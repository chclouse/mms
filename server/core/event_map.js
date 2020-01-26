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
		this._map = Object.assign(this._map, map);
	}

	/**
	 * Handle a request
	 */
	handle(message, ...extra) {
		let req = JSON.parse(message);
		if (req['id'] in this._map) {
			this._context[req['id']].apply(this._context, ...extra, ...req['params']);
		}
	}
}

module.exports = { EventMap };
