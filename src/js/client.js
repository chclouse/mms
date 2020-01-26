/**
 * States to indicated the connection status
 */
const State = {
	IDLE      : 0,
	CONNECTING: 1,
	CONNECTED : 2,
	JOINING   : 3,
	READY     : 4
};

class Client {

	constructor(address, port) {
		this._address = address;
		this._port = port;
		this._state = State.IDLE;
	}

	onOpen(event) {
		this.createGame();
	}

	onReceive(message) {
		console.log(message);
	}

	encode(functionId, ...params) {
		return JSON.stringify({
			id: functionId,
			params
		});
	}

	connect() {
		this._ws = new WebSocket(`ws://${this._address}:${this._port}`);
		this._ws.onopen = (event) => { this.onOpen(event) };
		this._ws.onmessage = (message) => { this.onReceive(message) };
	}

	createGame() {
		var FUNCTION_ID = 'createGame';
		this._ws.send(this.encode(FUNCTION_ID));
	}

	join(gameId) {
		var FUNCTION_ID = 'join';
		this._ws.send(this.encode(FUNCTION_ID, gameId));
	}

	leave() {
		var FUNCTION_ID = 'leave';
		this._ws.send(this.encode(FUNCTION_ID));
	}

	close() {
		var FUNCTION_ID = 'close';
		this._ws.send(this.encode(FUNCTION_ID));
		this._ws.close()
	}

	click(row, col) {
		var FUNCTION_ID = 'click';
		this._ws.send(this.encode(FUNCTION_ID, row, col));
	}

	flag(row, col) {
		var FUNCTION_ID = 'flag';
		this._ws.send(this.encode(FUNCTION_ID, row, col));
	}

	usePowerup(id, info) {
		var FUNCTION_ID = 'usePowerup';
		this._ws.send(this.encode(FUNCTION_ID, id, info));
	}

	keepAlive() {
		var FUNCTION_ID = 'keepAlive';
		this._ws.send(this.encode(FUNCTION_ID));
	}
}

module.exports = {
	Client,
	State
}
