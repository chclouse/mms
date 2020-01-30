import { EventMap } from "./event_map";
import { EventEmitter } from "events";
import { Player, IPlayerMap } from "./player";

const MineSweeper = require("../map/tilemap.js");
const Mines = require("../ent/mine.js");
const Entities = require("../ent/entity.js");

/**
 * The possible states for the game
 */
export enum GameState {
	Joining,
	Countdown,
	Running,
	Finished
}

export class Game extends EventEmitter {

	private _players:  IPlayerMap = {};
	private _eventMap: EventMap = new EventMap(this);
	private _mineSweeper = new MineSweeper.TileMap(100, 100)
	private _state: GameState = GameState.Joining;
	private _playerIndex: number = 0;

	public isInProgress: boolean = false;
	public maxPlayers: number;

	constructor (maxPlayers: number) {
		super();
		this.maxPlayers = maxPlayers;
		this._mineSweeper.generateBoard(2000, 0);
	}

	/**
	 * Let any users know that the game has been destroyed
	 */
	destroy() {
		for (let p of Object.values(this._players)) {
			p.kick("Game Closed");
		}
	}

	/**
	 * Check to see if a player can join the game
	 */
	canJoin() {
		return this._state == GameState.Joining &&
			this._playerIndex < this.maxPlayers && !this.isInProgress;
	}

	/**
	 * Add a player to the game
	 */
	addPlayer(player: Player) {
		player.hasGrace = true;
		player.game = this;
		player.playerIndex = this._playerIndex++;
		player.score = 0;
		for (let p of Object.values(this._players)) {
			p.playerJoined(player);
		}
		this._players[player.id] = player;
		console.log(player.name, "joined a game");
	}

	/**
	 * Remove a player from the game
	 *
	 * @TODO
	 */
	removePlayer(player: Player, reason: string) {
		delete this._players[player.id];
		for (let p of Object.values(this._players)) {
			p.playerLeft(player, reason);
		}
		if (this.playerCount() == 0) {
			this.emit("destroy", this);
		}
	}

	/**
	 * Get the number of players currently in the game
	 */
	playerCount() {
		return Object.keys(this._players).length;
	}

	/**
	 * Get the list of players
	 */
	players() {
		return Object.values(this._players);
	}

	/**
	 * @TODO
	 * The x and y of player death location was unpacked previously. Now it's multiple vars
	 */
	onClick(player: Player, x: number, y: number) {
		this.isInProgress = true;
		if (player.hasDied) {
			return;
		}

		let data = this._mineSweeper.clickTile(player.id, x, y, player.hasGrace);
		player.hasGrace = false;
		let entLength = data[0].length;
		if (entLength > 0 && data[0][0] instanceof Mines.Mine) {
			let x = data[1][0][0];
			let y = data[1][0][1];
			this.die(player, x, y);
			for (let p of Object.values(this._players).filter((i) => i != player)) {
				p.playerDied(player);
			}
		} else {
			player.reveal(data[1])
			player.score += data[1].length;
			for (let p of Object.values(this._players).filter((i) => i != player)) {
				p.claim(player, data[1])
			}
			for (let p of Object.values(this._players)) {
				p.updateScores(player);
			}
		}
	}

	onFlag(player: Player, x: number, y: number) {
		if (player.hasDied) {
			return;
		}

		this._mineSweeper.flagTile(player.id, x, y);
	}

	onUnflag(player: Player, x: number, y: number) {
		if (player.hasDied) {
			return;
		}

		this._mineSweeper.unflagTile(player.id, x, y);
	}

	/**
	 * Handle any message events from clients
	 */
	update(player: Player, message: string) {
		this._eventMap.handle(message, player);
	}

	die(player: Player, x: number, y: number) {
		console.log("Player died", player.id, ".");
		player.hasDied = true;
		player.die(x, y);
		for (let p of Object.values(this._players).filter((i) => i != player)) {
			p.playerDied(player);
		}
	}

	/**
	 * Kick a player from the game
	 *
	 * @TODO
	 */
	kick(player: Player, reason: string) {
		console.log("Kicking player", player.id, "for reason:", reason);
		player.kick(reason);
		this.removePlayer(player, reason);
	}
}
