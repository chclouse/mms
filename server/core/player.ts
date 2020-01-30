import { Game } from "./game";
import * as util from "./util";
import WebSocket from "ws";

/**
 * Map players by a string
 */
export interface IPlayerMap {
	[key: string]: Player
};

export class Player {
	public hasDied    : boolean = false;
	public hasGrace   : boolean = false;
	public state      : string = "";
	public id         : string;
	public game      ?: Game;
	public name       : string = "";
	public ping       : number = 0;
	public playerIndex: number = 0;
	public score      : number = 0;
	public sock: WebSocket;

	/**
	 * @TODO Change sock to the proper websocket type
	 */
	constructor(sock: any) {
		this.sock = sock;
		this.id = this._createId(sock._socket.remoteAddress, sock._socket.remotePort);
	}

	/**
	 * Create an identifier for the user
	 */
	private _createId(ip: string, port: number) {
		return `${ip}:${port}`;
	}

	// Websocket Functions -------------------------------------------------------------------------

	/**
	 * Inform the user that they have joined the server
	 *
	 * @TODO
	 */
	join(playerIndex?: number, error?: number) {
		const FUNCTION_ID = 'join'
		this.sock.send(util.encode(FUNCTION_ID, playerIndex, error));
	}

	/**
	 * Inform the user that they have died
	 */
	die(x: number, y: number) {
		const FUNCTION_ID = 'die';
		this.sock.send(util.encode(FUNCTION_ID, x, y));
	}

	/**
	 * Inform the user that the given tiles have been revealed
	 *
	 * @TODO
	 */
	reveal(positionsWithHints: any) {
		const FUNCTION_ID = 'reveal';
		this.sock.send(util.encode(FUNCTION_ID, positionsWithHints));
	}

	/**
	 * Inform the user that some territory has been claimed
	 *
	 * @TODO
	 */
	claim(player: Player, positions: any) {
		const FUNCTION_ID = 'claim';
		this.sock.send(util.encode(FUNCTION_ID, player.playerIndex, positions));
	}

	/**
	 * Inform the user that they have been kicked
	 *
	 * @TODO
	 */
	kick(reason: string) {
		const FUNCTION_ID = 'kick';
		this.sock.send(util.encode(FUNCTION_ID, reason));
	}

	/**
	 * Inform the user that a player has joined
	 */
	playerJoined(player: Player) {
		const FUNCTION_ID = 'playerJoin';
		this.sock.send(util.encode(FUNCTION_ID, player.name, player.playerIndex));
	}

	/**
	 * @TODO
	 */
	playerLeft(player: Player, reason: string) {
		const FUNCTION_ID = 'playerLeave';
		this.sock.send(util.encode(FUNCTION_ID, player.name, player.playerIndex));
	}

	playerDied(player: Player) {
		const FUNCTION_ID = 'playerDied';
		this.sock.send(util.encode(FUNCTION_ID, player.name, player.playerIndex));
	}

	updateScores(player: Player) {
		const FUNCTION_ID = 'updateScores';
		this.sock.send(util.encode(FUNCTION_ID, player.name, player.playerIndex, player.score))
	}
}
