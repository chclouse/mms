import { Game } from "./game";
import { IAddressInfo, SocketWrapper, Remote } from "./network";
import { Mms } from "../mms";

/**
 * Map players by a string
 */
export interface IPlayerMap {
	[key: string]: Player
};

export class Player extends SocketWrapper {

	/**
	 * Public address information
	 */
	private readonly _address: IAddressInfo

	/**
	 * A unique identifier for the player
	 */
	public readonly id: string;

	/**
	 * An instance to MMS
	 */
	private _mms: Mms;

	/**
	 * Other Parameters
	 */
	public hasDied    : boolean = false;
	public hasGrace   : boolean = false;
	public state      : string = "";
	public game      ?: Game;
	public name       : string = "";
	public playerIndex: number = 0;
	public score      : number = 0;

	/**
	 * @TODO Change sock to the proper websocket type
	 */
	constructor(sock: WebSocket, ip: string, port: number) {
		super();
		this.id = `${ip}:${port}`;
		this._address = { ip, port };
		this.setSocket(sock);
	}

	/**
	 * Connect the player to MMS
	 */
	@Remote
	connect(mms: Mms) {
		this._mms = mms;
	}

	// Client Events -------------------------------------------------------------------------------

	onClick(row: number, col: number) {
		this.game.click(this, row, col);
	}

	onFlag(row: number, col: number) {
		this.game.flag(this, row, col);
	}

	onUnflag(row: number, col: number) {
		this.game.unflag(this, row, col);
	}

	onDie(row: number, col: number) {
		this.game.die(this, row, col);
	}

	/**
	 * Invoked when a player is requesting to join a game
	 */
	onJoin(username: string) {
		console.log("Looking for game...");
		let game = this._mms.findGame();
		this.name = username;
		if (game.canJoin()) {
			game.addPlayer(this)
			return this.join(this.playerIndex, 0);
		}
		return this.join(undefined, 1);
	}

	// Remote Methods ------------------------------------------------------------------------------

	/**
	 * Inform the user that they have joined the server
	 *
	 * @TODO
	 */
	@Remote
	join(playerIndex?: number, error?: number) {
		return [playerIndex, error];
	}

	/**
	 * Inform the user that they have died
	 */
	@Remote
	die(x: number, y: number) {
		return [x, y];
	}

	/**
	 * Inform the user that the given tiles have been revealed
	 *
	 * @TODO
	 */
	@Remote
	reveal(positionsWithHints: any) {
		return [positionsWithHints];
	}

	/**
	 * Inform the user that some territory has been claimed
	 *
	 * @TODO
	 */
	@Remote
	claim(player: Player, positions: any) {
		return [player.playerIndex, positions]
	}

	/**
	 * Inform the user that they have been kicked
	 *
	 * @TODO
	 */
	@Remote
	kick(reason: string) {
		return [reason];
		// this.send(Event.RemovePlayer, reason);
	}

	/**
	 * Inform the user that a player has joined
	 */
	@Remote
	playerJoined(player: Player) {
		return [player.name, player.playerIndex];
	}

	/**
	 * Inform the user that another player has left
	 */
	@Remote
	playerLeft(player: Player, reason: string) {
		return [player.name, player.playerIndex, reason];
	}

	/**
	 * Inform the user that another player has died
	 */
	@Remote
	playerDied(player: Player) {
		return [player.name, player.playerIndex];
	}

	/**
	 * Inform the user that another player's score has changed
	 */
	@Remote
	updateScores(player: Player) {
		return [player.name, player.playerIndex, player.score];
	}
}
