class Game {
	id;
	_playerList = [];
	maxPlayers;

	constructor (maxPlayers, id) {
		this.id = id;
		this.maxPlayers = maxPlayers;
	}

	addPlayer(player) {
		if (this._playerIdList.length < this.maxPlayers) {
			this.onPlayerJoin(player);
			return true;
		} else {
			return false;
		}
	}

	update() {

	}

	onPlayerJoin(player) {
		this._playerIdList.push(player);
		// Alert other players
	}
}

module.exports = {Game}
