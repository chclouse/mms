import { Game } from "./game";
import { Player } from "./player";
import WebSocket from "ws";
import { IncomingMessage } from "http";
import { EventEmitter } from "events";

export class Server extends EventEmitter {

	private _connections  : Set<Player> = new Set<Player>();
	private _port         : number;
	private _socket      ?: WebSocket.Server;
	private _games        : Game[] = []
	private _pingInterval?: NodeJS.Timeout;

	constructor (port: number) {
		super();
		this._port = port;
	}

	/**
	 * Start the server
	 */
	run() {
		this._socket = new WebSocket.Server({ port: this._port });
		this._socket.on('connection', (sock, req) => this.onConnect(sock, req));
		this._pingInterval = setInterval(() => this.keepAlive(), 5000);
	}

	/**
	 * Remove any dead players
	 */
	keepAlive() {
		let t = new Date().getTime() - 10000;
		for (let game of Object.values(this._games)) {
			for (let player of game.players()) {
				if (player.lastPing() < t) {
					game.kick(player, 'timeout');
				}
			}
		}
	}

	// Web Socket Events ---------------------------------------------------------------------------

	/**
	 * Invoked when a player has established a connection to the server
	 */
	onConnect(sock: any, req: IncomingMessage) {
		console.log("A player has connected");
		let player = new Player(sock, req.connection.remoteAddress, req.connection.remotePort);
		player.on("close", () => this._connections.delete(player));
		this._connections.add(player);
		this.emit("connected", player);
	}
}
