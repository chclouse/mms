const EventMap = require("./event_map");

class Game {
	id;
	_playerList = [];
	maxPlayers;
	_eventMap = new EventMap.EventMap(this);

	constructor (maxPlayers, id) {
		this.id = id;
		this.maxPlayers = maxPlayers;
	}

	addPlayer(player) {
		if (this._playerList.length < this.maxPlayers) {
			this.onPlayerJoin(player);
			return true;
		} else {
			return false;
		}
	}

	update(player, message) {
		this._eventMap.handle(message, player);
	}

	onPlayerJoin(player) {
		for (p of this._playerList) {
			p.onPlayerJoin(player);
		}
		this._playerList.push(player);
	}
}


module.exports = {Game}
