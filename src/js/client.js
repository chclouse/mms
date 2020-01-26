const EventMap = require("../../server/core/event_map");
const Minesweeper = require("./minesweeper");

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
		this._map = new EventMap.EventMap(this);
		Minesweeper.emitter.on("reveal", (r, c) => this.click(r, c));
	}

	ping() {
		this._ws.send("ping");
	}

	onOpen(event) {
		this._pingInterval = setInterval(() => this.ping(), 5000);
	}

	onReceive(message) {
		this._map.handle(message.data);
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

	join(username) {
		var FUNCTION_ID = 'join';
		this._ws.send(this.encode(FUNCTION_ID, username));
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

	// Server Events -------------------------------------------------------------------------------

	onClaim(playerId, positions) {
		console.log("Claiming Positions:", playerId, p);
	}

	onDie(x, y) {

	}

	onKick(reason) {
		alert("You have been kicked! Reason:", reason);
		self._ws.close();
	}

	onReveal(positions) {
		for (let p of positions) {
			console.log("Unpacked", p);
			Minesweeper.revealTile(...p);
		}
	}

	onJoin() {
		Minesweeper.init();
		$(".login").fadeOut(1000);
	}
}

module.exports = {
	Client,
	State
}
