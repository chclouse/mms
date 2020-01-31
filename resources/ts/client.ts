import { EventMap } from "../../server/core/event_map";
import * as Minesweeper from "./minesweeper";

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

export class Client {

	private _address: string;
	private _port: number;
	private _state: State;
	private _map: EventMap;
	private _ws?: WebSocket;
	private _pingInterval?: NodeJS.Timeout;

	public playerIndex: number;


	constructor(address: string, port: number) {
		this._address = address;
		this._port = port;
		this._state = State.Idle;
		this._map = new EventMap(this);
		Minesweeper.emitter.on("reveal", (r, c) => this.click(r, c));
		Minesweeper.emitter.on("flag", (r, c) => this.flag(r, c));
		Minesweeper.emitter.on("unflag", (r, c) => this.unflag(r, c));
	}

	toast(message: string) {
		let toast = $("<div class='toast' style='display: none'></div>").html(message);
		$(".toast-area").append(toast);
		setTimeout(() => { toast.fadeIn(500).delay(5000).fadeOut(500) });
		setTimeout(() => toast.remove(), 6000);
	}

	ping() {
		this._ws.send("ping");
	}

	onOpen(event: any) {
		this._pingInterval = setInterval(() => this.ping(), 5000);
	}

	onReceive(message: MessageEvent) {
		this._map.handle(message.data);
	}

	encode(functionId: string, ...params: any) {
		return JSON.stringify({
			id: functionId,
			params
		});
	}

	connect() {
		this._ws = new WebSocket(`ws://${this._address}:${this._port}`);
		this._ws.onopen = (event) => { this.onOpen(event) };
		this._ws.onmessage = (message) => { this.onReceive(message) };
	}

	join(username: string) {
		var FUNCTION_ID = 'join';
		this._ws.send(this.encode(FUNCTION_ID, username));
	}

	leave() {
		var FUNCTION_ID = 'leave';
		this._ws.send(this.encode(FUNCTION_ID));
	}

	close() {
		var FUNCTION_ID = 'close';
		this._ws.send(this.encode(FUNCTION_ID));
		this._ws.close()
	}

	click(row: number, col: number) {
		var FUNCTION_ID = 'click';
		this._ws.send(this.encode(FUNCTION_ID, row, col));
	}

	flag(row: number, col: number) {
		var FUNCTION_ID = 'flag';
		this._ws.send(this.encode(FUNCTION_ID, row, col));
	}

	unflag(row: number, col: number) {
		var FUNCTION_ID = 'unflag';
		this._ws.send(this.encode(FUNCTION_ID, row, col));
	}

	usePowerup(id: number, info: any) {
		var FUNCTION_ID = 'usePowerup';
		this._ws.send(this.encode(FUNCTION_ID, id, info));
	}

	keepAlive() {
		var FUNCTION_ID = 'keepAlive';
		this._ws.send(this.encode(FUNCTION_ID));
	}

	// Server Events -------------------------------------------------------------------------------

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
		this._ws.close();
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
		$(".bar").removeClass("invisible");
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
}
