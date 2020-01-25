const WebSocket = require('ws');

class Server {
	_port;
	_socket;

	constructor (port) {
		this._port = port;
	}

	run() {
		this._socket = new WebSocket.Server({ port: this._port });
		this._socket.on('connection', (sock) => this.onConnect(sock));
	}

	onConnect(sock) {
		sock.on('message', (message) => this.onReceive(sock, message));
	}

	onReceive(sock, message) {
		console.log(message);
	}

}

module.exports = {Server}
