const WebSocket = require('ws');
const Players = require('./player.js');
const Games = require('./game.js');
const EventMap = require('./event_map');

class Server {
	_port;
	_socket;
	_games = [];
	_players = {};
	_map = new EventMap.EventMap(this);
	_pingInterval = null;

	constructor (port) {
		this._port = port;
		this._numIds = 0;
	}

	/**
	 * Start the server
	 */
	run() {
		this._socket = new WebSocket.Server({ port: this._port });
		this._socket.on('connection', (sock) => this.onConnect(sock));
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
	 * Create an identifier for the user
	 */
	createId(ip, port) {
		return `${ip}:${port}`;
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
		let game = new Games.Game(4);
		this._games.push(game);
		return game;
	}

	// Client Actions ------------------------------------------------------------------------------

	/**
	 * Invoked when a player is requesting to join a game
	 */
	onJoin(player, username) {
		let game = this.findGame();
		console.log(username);
		player.name = username;
		if (game.addPlayer(player)) {
			return player.join(game.id, 0);
		}
		return player.join(null, 1);
	}

	// Web Socket Events ---------------------------------------------------------------------------

	/**
	 * Invoked when a player has established a connection to the server
	 */
	onConnect(sock) {
		console.log("Connection fired");
		let player = new Players.Player(sock);
		player.id = this.createId(sock._socket.remoteAddress, sock._socket.remotePort);
		player.state = "connected";
		player.sock = sock

		sock.on('message', (message) => this.onReceive(message, player));
		sock.on('pong', () => this.onPing(sock, player));
		this.onPing(player);
	}

	/**
	 * Invoked when the client pings the server
	 */
	onPing(player) {
		player.ping = new Date().getTime();
	}

	/**
	 * Invoked when the server receives a message from the client
	 */
	onReceive(message, player) {
		this.onPing(player);
		if (player.gameId != null) {
			this._games[player.gameId].update(player, message);
		} else {
			this._map.handle(message, player);
		}
	}
}

module.exports = {Server}
