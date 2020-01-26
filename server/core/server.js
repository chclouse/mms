const WebSocket = require('ws');
const Players = require('./player.js');
const Games = require('./game.js');

class Server {
	_port;
	_socket;
	_games = {};
	_players = {};

	constructor (port) {
		this._port = port;
		this._numIds = 0;
	}

	run() {
		this._socket = new WebSocket.Server({ port: this._port });
		this._socket.on('connection', (sock) => this.onConnect(sock));
	}

	createId(ip, port) {
		newId = `${ip}:${port}`;
		return newId;
	}

	onConnect(sock) {
		player = new Players.Player();
		player.id = createId(sock.remoteAddress, sock.remotePort);
		player.state = "connected";
		player.sock = sock

		sock.on('message', (message) => this.onReceive(message, player));
		sock.on('pong', () => this.onPing(sock, player));
	}

	onPing(sock, player) {
		player.interval = new Date().getTime();
	}

	createGame(player) {
		this._games[player.id] = new Games.Game(4, player.id);
		this.joinGame(player, player.id);
		return true;
	}

	joinGame(player, id) {
		this._games[player.id].addPlayer(player);
		player.onJoin(gameId);
	}

	onReceive(message, player) {
		onPing(player.sock, player);
		data = JSON.parse(message);
		if (player.gameId != null) {
			this._games[player.gameId].update(data, player.id);
		} else {
			if (data['id'] == "create") {
				this.createGame(player)
				player.sock.send()
			} else {

			}
		}
		console.log(message);
	}

}

module.exports = {Server}
