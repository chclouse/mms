const EventMap = require("./event_map");

const State = {
	JOINING  : 0,
	COUNTDOWN: 1,
	RUNNING  : 2,
	FINISHED : 3,
};

class Game {
	__players = {};
	_eventMap = new EventMap.EventMap(this);
	_state = State.JOINING;
	maxPlayers;

	constructor (maxPlayers) {
		this.maxPlayers = maxPlayers;
	}

	/**
	 * Check to see if a player can join the game
	 */
	canJoin() {
		return this._state == State.JOINING &&
			Object.keys(this.__players).length < this.maxPlayers;
	}

	/**
	 * Add a player to the game
	 */
	addPlayer(player) {
		for (p of Object.values(this.__players)) {
			p.onPlayerJoin(player);
		}
		this.__players[player.id] = player;
	}

	/**
	 * Remove a player from the game
	 */
	removePlayer(player, reason) {
		delete this.__players[player.id];
		for (p of Object.values(this.__players)) {
			p.onPlayerLeave(player, reason);
		}
	}

	/**
	 * Get the list of players
	 */
	players() {
		return Object.values(this.__players);
	}

	/**
	 * Handle any message events from clients
	 */
	update(player, message) {
		this._eventMap.handle(message, player);
	}

	/**
	 * Kick a player from the game
	 */
	kick(player, reason) {
		console.log("Kicking player", player.id, "for reason:", reason);
		player.kick(reason);
		this.removePlayer(player, reason);
	}
}

module.exports = {
	Game,
	State
};
