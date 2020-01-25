class Game {
	id;
	_free;
	_playerIdList = [];
	allowedPlayers;

	constructor (allowedPlayers) {
		this.allowedPlayers = allowedPlayers;
		this._free = true;
	}

	addPlayer(id) {
		if (this._free == true) {
			this._playerIdList.push(id);
			if (this._playerIdList.length == this.allowedPlayers) {
				this._free = false;
			}
			return true;
		} else {
			return false;
		}
	}

	removePlayer(id) {
		
	}

}
