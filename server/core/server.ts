import { EventMap } from "./event_map";
import { Game } from "./game";
import { Player, IPlayerMap } from "./player";
import WebSocket from "ws";

export class Server {

	private _port         : number;
	private _socket      ?: WebSocket.Server;
	private _games        : Game[] = []
	private _players      : IPlayerMap = {};
	private _map          : EventMap = new EventMap(this);
	private _pingInterval?: NodeJS.Timeout;

	constructor (port: number) {
		this._port = port;
	}

	/**
	 * Start the server
	 */
	run() {
		this._socket = new WebSocket.Server({ port: this._port });
		this._socket.on('connection', (sock: WebSocket) => this.onConnect(sock));
		this._pingInterval = setInterval(() => this.keepAlive(), 5000);
	}

	/**
	 * Remove any dead players
	 */
	keepAlive() {
		let t = new Date().getTime() - 10000;
		for (let game of Object.values(this._games)) {
			for (let player of game.players()) {
				if (player.ping < t) {
					game.kick(player, 'timeout');
				}
			}
		}
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

	/**
	 * Create a new game
	 */
	createGame() {
		console.log("Creating game...");
		let game = new Game(4);
		game.on("destroy", (game) => { this.destroyGame(game) });
		this._games.push(game);
		return game;
	}

	/**
	 * Destroy an existing game
	 */
	destroyGame(game: Game) {
		let index = this._games.indexOf(game);
		if (index != -1) {
			this._games.splice(index);
			game.destroy();
		}
	}

	// Client Actions ------------------------------------------------------------------------------

	/**
	 * Invoked when a player is requesting to join a game
	 */
	onJoin(player: Player, username: string) {
		let game = this.findGame();
		player.name = username;
		if (game.canJoin()) {
			game.addPlayer(player)
			return player.join(player.playerIndex, 0);
		}
		return player.join(undefined, 1);
	}

	// Web Socket Events ---------------------------------------------------------------------------

	/**
	 * Invoked when a player has established a connection to the server
	 */
	onConnect(sock: any) {
		console.log("Connection fired");
		let player = new Player(sock);
		player.state = "connected";
		player.sock = sock

		sock.on('message', (message: string) => this.onReceive(message, player));
		this.onPing(player);
	}

	/**
	 * Invoked when the client pings the server
	 */
	onPing(player: Player) {
		player.ping = new Date().getTime();
	}

	/**
	 * Invoked when the server receives a message from the client
	 */
	onReceive(message: string, player: Player) {
		this.onPing(player);
		if (message != "ping") {
			if (player.game != null) {
				player.game.update(player, message);
			} else {
				this._map.handle(message, player);
			}
		}
	}
}
