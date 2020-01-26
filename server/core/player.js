
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

	}
}

module.exports = {Player}
