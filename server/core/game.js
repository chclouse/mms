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
	_players = {};
	_eventMap = new EventMap.EventMap(this);
	_mineSweeper = new MineSweeper.TileMap(100, 100)
	_state = State.JOINING;
	maxPlayers;
	_playerIndex = 0;

	constructor (maxPlayers) {
		this.maxPlayers = maxPlayers;
		this._mineSweeper.generateBoard(2500, 0)
	}

	/**
	 * Check to see if a player can join the game
	 */
	canJoin() {
		return this._state == State.JOINING &&
			Object.keys(this._players).length < this.maxPlayers;
	}

	/**
	 * Add a player to the game
	 */
	addPlayer(player) {
		for (let p of Object.values(this._players)) {
			p.playerJoined(player);
		}
		player.playerIndex = this._playerIndex++;
		this._players[player.id] = player;
		player.game = this;
		player.hasDied = false;
		player.hasGrace = true;
		console.log(player.name, "joined a game");
	}

	/**
	 * Remove a player from the game
	 */
	removePlayer(player, reason) {
		delete this._players[player.id];
		for (let p of Object.values(this._players)) {
			p.playerLeft(player, reason);
		}
	}

	/**
	 * Get the list of players
	 */
	players() {
		return Object.values(this._players);
	}

	onClick(player, x, y, flags) {
		if (player.hasDied) {
			return;
		}

		let data = this._mineSweeper.revealTiles(player.id, x, y, flags, player.hasGrace);
		player.hasGrace = false;
		let entLength = data[0].length;
		if (entLength > 0 && data[0][0] instanceof Mines.Mine) {
			this.die(player, x, y);
		} else {
			player.reveal(data[1])
			console.log(data[1]);
			for (let p of Object.values(this._players).filter((i) => i != player)) {
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
		player.hasDied = true;
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
