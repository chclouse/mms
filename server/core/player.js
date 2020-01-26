util = require('./util');

class Player {
	id;
	state;
	gameId;
	name;
	ping;
	_sock;

	constructor(sock) {
		this._sock = sock;
	}

	timeout() {

	}

	update(message) {

	}

	onJoin(gameId, error) {
		this._sock
	}

	onPlayerJoin(player) {

	}

	onPlayerLeave(player, reason) {
		console.log("Player left");
	}

	// Websocket functions
	die(x, y) {
		const FUNCTION_ID = 'die';
		this._sock.send(util.encode(FUNCTION_ID, x, y));
	}

	reveal(positionsWithHints) {
		const FUNCTION_ID = 'reveal';
		this._sock.send(util.encode(FUNCTION_ID, positionsWithHints));
	}

	claim(playerId, positions) {
		const FUNCTION_ID = 'claim';
		this._sock.send(util.encode(FUNCTION_ID, playerId, positions));
	}

	kick(gameId, reason) {
		const FUNCTION_ID = 'kick';
		this._sock.send(util.encode(FUNCTION_ID, gameId, reason));
	}
}

module.exports = {Player}
