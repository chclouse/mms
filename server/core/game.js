const EventMap = require("./event_map");
const MineSweeper = require("../map/tilemap.js");
const Mines = require("../ent/mine.js");
const Entities = require("../ent/entity.js");

const State = {
	JOINING  : 0,
	COUNTDOWN: 1,
	RUNNING  : 2,
	FINISHED : 3,
};

class Game {
	__players = {};
	_eventMap = new EventMap.EventMap(this);
	_mineSweeper = new MineSweeper.TileMap(100, 100)
	_state = State.JOINING;
	maxPlayers;

	constructor (maxPlayers) {
		this.maxPlayers = maxPlayers;
		this._mineSweeper.generateBoard(2500, 0)
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
		for (let p of Object.values(this.__players)) {
			p.playerJoined(player);
		}
		this.__players[player.id] = player;
		console.log(player.name, "joined a game");
	}

	/**
	 * Remove a player from the game
	 */
	removePlayer(player, reason) {
		delete this.__players[player.id];
		for (let p of Object.values(this.__players)) {
			p.playerLeft(player, reason);
		}
	}

	/**
	 * Get the list of players
	 */
	players() {
		return Object.values(this.__players);
	}

	onClick(player, x, y, flags) {
		data = this._mineSweeper.revealTiles(player.id, x, y, flags);
		entLength = data[0].length;
		if (entLength > 0 && data[0][0] instanceof Mines.Mine) {
			this.die(player, x, y);
		} else {
			player.reveal(data[1])
			for (p of Object.values(this._players).filter((i) => i != player)) {
				p.claim(player, data[1])
			}
		}
	}

	/**
	 * Handle any message events from clients
	 */
	update(player, message) {
		this._eventMap.handle(message, player);
	}

	die(player, x, y) {
		console.log("Player died", player.id, ".");
		player.die(x, y);
		for (let p of Object.values(this._players).filter((i) => i != player)) {
			p.playerDied(player);
		}
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
