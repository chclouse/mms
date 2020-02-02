import * as Minesweeper from "./minesweeper";
import { SocketWrapper, IAddressInfo, Remote } from "../../server/core/network";

type HintedPosition = [number, number, number];

/**
 * States to indicated the connection status
 */
export enum State {
	Idle,
	Connecting,
	Connected,
	Joining,
	Ready
};

export class Client extends SocketWrapper {

	private readonly _address: IAddressInfo;
	private _state: State;
	private _pingInterval?: NodeJS.Timeout;

	public playerIndex: number;

	constructor(ip: string, port: number) {
		super();
		this._address = {ip, port};
		this._state = State.Idle;
		Minesweeper.emitter.on("reveal", (r, c) => this.click(r, c));
		Minesweeper.emitter.on("flag", (r, c) => this.flag(r, c));
		Minesweeper.emitter.on("unflag", (r, c) => this.unflag(r, c));
		Minesweeper.init();
	}

	// Overridden Events ---------------------------------------------------------------------------

	/**
	 * Invoked when a connection to the server has been established
	 */
	onOpen() {
		//
	}

	// Unorganized ---------------------------------------------------------------------------------

	connect() {
		this.open(this._address.ip, this._address.port, false);
	}

	@Remote
	join(username: string) {
		return [username];
	}

	@Remote
	click(row: number, col: number) {
		return [row, col];
	}

	@Remote
	flag(row: number, col: number) {
		return [row, col];
	}

	@Remote
	unflag(row: number, col: number) {
		return [row, col];
	}

	@Remote
	usePowerup(id: number, info: any) {
		return [id, info];
	}

	// Server Events -------------------------------------------------------------------------------

	onConnect() {
		console.log("Connected to the server");
		this._pingInterval = setInterval(() => this.ping(), 5000);
	}

	onClaim(playerIndex: number, positions: HintedPosition[]) {
		console.log("Claiming Positions:", playerIndex, positions);
		for (let p of positions) {
			Minesweeper.claimTile(p[0], p[1], playerIndex);
		}
	}

	onDie(r: number, c: number) {
		console.log("You died....", r, c);
		$(`.team-${this.playerIndex}`).addClass("struck");
		Minesweeper.revealTile(r, c, -1);
		Minesweeper.enableInteraction(false);
	}

	onKick(reason: string) {
		alert(`You have been kicked! Reason: ${reason}`);
		this.close();
	}

	onReveal(positions: HintedPosition[]) {
		for (let p of positions) {
			Minesweeper.revealTile(...p);
		}
	}

	onJoin(playerIndex: number) {
		console.log("The player index is", playerIndex);
		this.playerIndex = playerIndex;
		Minesweeper.init();
		$(".struck").removeClass("struck");
		$(".marked").removeClass("marked");
		$(`.team-${playerIndex}`).addClass("marked");
		$(".main-container").removeClass("invisible");
		$(".login").fadeOut(1000);
	}

	onPlayerJoin(username: string, playerIndex: number) {
		this.toast(`${username} joined.`);
	}

	onPlayerDied(username: string, playerIndex: number) {
		console.log("A player died", playerIndex);
		$(`.team-${playerIndex}`).addClass("struck");
	}

	onUpdateScores(username: string, playerIndex: number, score: number) {
		console.log("Updating scores...");
		$(`.team-${playerIndex}`).html(score.toString());
	}

	// Temporary -----------------------------------------------------------------------------------

	/**
	 * @TODO This should not be in the client class
	 * Display a toast on screen
	 */
	toast(message: string) {
		let toast = $("<div class='toast' style='display: none'></div>").html(message);
		$(".toast-area").append(toast);
		setTimeout(() => { toast.fadeIn(500).delay(5000).fadeOut(500) });
		setTimeout(() => toast.remove(), 6000);
	}
}
