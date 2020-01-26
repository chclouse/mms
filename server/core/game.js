const EventMap = require("./event_map");

class Game {
	id;
	_playerList = {};
	maxPlayers;
	_eventMap = new EventMap.EventMap(this);

	constructor (maxPlayers, id) {
		this.id = id;
		this.maxPlayers = maxPlayers;
	}

	addPlayer(player) {
		if (Object.keys(this._playerList).length < this.maxPlayers) {
			for (p of Object.values(this._playerList)) {
				p.onPlayerJoin(player);
			}
			this._playerList[player.id] = player;
			return true;
		}
		return false;
	}

	removePlayer(player, reason) {
		delete this._playerList[player.id];
		for (p of Object.values(this._playerList)) {
			p.onPlayerLeave(player, reason);
		}
	}

	players() {
		return Object.values(this._playerList);
	}

	update(player, message) {
		this._eventMap.handle(message, player);
	}

	kick(player, reason) {
		console.log("Kicking player", player.id, "for reason:", reason);
		player.kick(this.id, reason);
		this.removePlayer(player, reason);
	}
}

module.exports = {Game}
