const EventMap = require("./event_map");

const State = {
	JOINING   = 0,
	COUNTDOWN = 1,
	RUNNING   = 2,
	FINISHED  = 3,
};

class Game {
	id;
	__players = {};
	_eventMap = new EventMap.EventMap(this);
	_state = State.JOINING;
	maxPlayers;

	constructor (maxPlayers, id) {
		this.id = id;
		this.maxPlayers = maxPlayers;
	}

	canJoin() {
		return this._state == State.JOINING &&
			Object.keys(this.__players).length < this.maxPlayers;
	}

	addPlayer(player) {
		for (p of Object.values(this.__players)) {
			p.onPlayerJoin(player);
		}
		this.__players[player.id] = player;
	}

	removePlayer(player, reason) {
		delete this.__players[player.id];
		for (p of Object.values(this.__players)) {
			p.onPlayerLeave(player, reason);
		}
	}

	players() {
		return Object.values(this.__players);
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

module.exports = {
	Game,
	State
}
