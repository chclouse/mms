import { Server } from "./core/server";
import { Game } from "./core/game";
import { Player } from "./core/player";

export class Mms {

	private _games: Set<Game> = new Set<Game>();

	/**
	 * Store the web socket server
	 */
	private _server: Server;

	constructor(port: number) {
		this._server = new Server(port);
	}

	/**
	 * Boot up MMS
	 */
	boot() {
		this._server.on("connected", (player) => this.onPlayerConnect(player));
		this._server.run();
	}

	// Events --------------------------------------------------------------------------------------

	/**
	 * Connect a player to MMS
	 */
	onPlayerConnect(player: Player) {
		player.connect(this);
	}

	// Player Accessable ---------------------------------------------------------------------------

	/**
	 * Create a new game
	 */
	createGame() {
		console.log("Creating game...");
		let game = new Game(4);
		game.on("destroy", this.destroyGame);
		this._games.add(game);
		return game;
	}

	/**
	 * Destroy an existing game
	 */
	destroyGame(game: Game) {
		if (this._games.has(game)) {
			this._games.delete(game);
		}
		game.destroy();
	}

	/**
	 * Find a joinable game. If none can be found, create one.
	 */
	findGame() {
		for (let game of this._games) {
			if (game.canJoin()) {
				return game;
			}
		}
		return this.createGame();
	}
}
