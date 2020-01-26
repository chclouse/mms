util = require('./util');

class Player {
	id;
	state;
	gameId;
	name;
	ping;
	playerIndex;
	_sock;

	constructor(sock) {
		this._sock = sock;
	}

	update(message) {

	}

	// Websocket Functions -------------------------------------------------------------------------

	/**
	 * Inform the user that they have joined the server
	 */
	join(index, error) {
		const FUNCTION_ID = 'join'
		this._sock.send(util.encode(FUNCTION_ID, index, error));
	}

	/**
	 * Inform the user that they have died
	 */
	die(x, y) {
		const FUNCTION_ID = 'die';
		this._sock.send(util.encode(FUNCTION_ID, x, y));
	}

	/**
	 * Inform the user that the given tiles have been revealed
	 */
	reveal(positionsWithHints) {
		const FUNCTION_ID = 'reveal';
		this._sock.send(util.encode(FUNCTION_ID, positionsWithHints));
	}

	/**
	 * Inform the user that some territory has been claimed
	 */
	claim(player, positions) {
		const FUNCTION_ID = 'claim';
		this._sock.send(util.encode(FUNCTION_ID, player.playerIndex, positions));
	}

	/**
	 * Inform the user that they have been kicked
	 */
	kick(reason) {
		const FUNCTION_ID = 'kick';
		this._sock.send(util.encode(FUNCTION_ID, reason));
	}

	/**
	 * Inform the user that a player has joined
	 */
	playerJoined(player) {
		const FUNCTION_ID = 'playerJoin';
		this._sock.send(util.encode(FUNCTION_ID, player.id));
	}

	playerLeft(player) {
		const FUNCTION_ID = 'playerLeave';
		this._sock.send(util.encode(FUNCTION_ID, player.id));
	}

	playerDied(player) {
		const FUNCTION_ID = 'playerDied';
		this.sock.send(util.encode(FUNCTION_ID, player.id));
	}
}

module.exports = {Player}
