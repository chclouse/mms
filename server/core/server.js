const WebSocket = require('ws');
const Players = require('./player.js');
const Random = require('random');

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
		player.state = "joined";


		sock.on('message', (message) => this.onReceive(sock, message, player));
		sock.on('pong', () => this.onPing(sock, player))
	}

	onPing(sock, player) {
		player.interval = new Date().getTime();
	}

	onReceive(sock, message, player) {
		onPing(sock, player)
		console.log(message);
	}

}

module.exports = {Server}
