encode = require('./utils').encode;

class Player {
	id;
	state;
	gameId;
	name;
	interval;
	_sock;

	constructor(sock) {
		this._sock = sock;
	}

	update(message) {

	}

	onJoin(gameId, error) {
		this._sock
	}

	onPlayerJoin(player) {

	}

	// Websocket functions
	die(x, y) {
		FUNCTION_ID = 'die';
		this._sock.send(encode(FUNCTION_ID, x, y));
	}

	reveal(positionsWithHints) {
		FUNCTION_ID = 'reveal';
		this._sock.send(encode(FUNCTION_ID, positionsWithHints));
	}

	claim(playerId, positions) {
		FUNCTION_ID = 'claim';
		this._sock.send(encode(FUNCTION_ID, playerId, positions));
	}
}

module.exports = {Player}
