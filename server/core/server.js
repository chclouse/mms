const WebSocket = require('ws');
const Players = require('./player.js');
const Games = require('./game.js');
const EventMap = require('./event_map');

class Server {
	_port;
	_socket;
	_games = {};
	_players = {};
	_map = new EventMap.EventMap(this);
	_pingInterval = null;

	constructor (port) {
		this._port = port;
		this._numIds = 0;
	}

	run() {
		this._socket = new WebSocket.Server({ port: this._port });
		this._socket.on('connection', (sock) => this.onConnect(sock));
		this._pingInterval = setInterval(() => this.keepAlive(), 5000);
	}

	keepAlive() {
		let t = new Date().getTime() - 10000;
		for (let game of Object.values(this._games)) {
			console.log("Looping through players...");
			for (let player of game.players()) {
				console.log(player.id, player.ping);
				if (player.ping < t) {
					console.log("Kicking player:", player.id);
					game.kick(player, 'timeout');
				}
			}
		}
	}

	createId(ip, port) {
		return `${ip}:${port}`;
	}

	createGame(player) {
		console.log("Creating game...", player);
		this._games[player.id] = new Games.Game(4, player.id);
		this.joinGame(player, player.id);
		return true;
	}

	joinGame(player) {
		let game = this._games[player.id];
		if (game) {
			if (game.addPlayer(player)) {
				return player.onJoin(game.id, 0);
			}
			return player.onJoin(null, 1);
		}
		return player.onJoin(null, 2);
	}

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

	onPing(player) {
		player.ping = new Date().getTime();
	}

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
