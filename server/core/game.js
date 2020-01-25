class Game {
	id;
	_free;
	_playerList = [];
	allowedPlayers;

	constructor (allowedPlayers, nid) {
		this.id = nid;
		this.allowedPlayers = allowedPlayers;
		this._free = true;
	}

	addPlayer(player) {
		if (this._free == true) {
			this._playerIdList.push(player);
			if (this._playerIdList.length == this.allowedPlayers) {
				this._free = false;
			}
			return true;
		} else {
			return false;
		}
	}

	update() {
		
	}

}

module.exports = {Player}
