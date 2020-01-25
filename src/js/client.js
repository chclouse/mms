class Client {

	constructor(address, port) {
	}

	onOpen(event) {

	}

	connect() {
		this._ws = new WebSocket(`ws://${address}:${port}`);
		this._ws.onopen = (event) => { this.onOpen(event) };
	}
}

module.exports = {Client}
