import { EventEmitter } from "events";

/**
 * Represents address information
 */
export interface IAddressInfo {
	ip  : string;
	port: number;
}

/**
 * [Decorator]
 * Invoke a remote method
 */
export function Remote<T extends SocketWrapper>(target: T, id: string, descr: PropertyDescriptor) {
	let method: Function = descr.value;
	descr.value = function (...args: any) {
		let context: T = <any>this;
		let params: any[] = method.apply(context, args);
		context.socket().send(JSON.stringify({ id, params }));
	}
}

export class SocketWrapper extends EventEmitter {

	/**
	 * The web socket
	 */
	private _sock: WebSocket;

	/**
	 * The last ping time
	 */
	private _ping: number = Date.now();

	/**
	 * Bind all of the methods for the communicator
	 */
	constructor() {
		super();
	}

	// Overridable Events --------------------------------------------------------------------------

	/**
	 * Invoked when the socket has established a connection
	 */
	onOpen() {
		//
	}

	/**
	 * Invoked when the socket has closed a connection
	 */
	onClose() {
		//
	}

	// Internal Handling ---------------------------------------------------------------------------

	/**
	 * Subscribe to the socket events
	 */
	private _connectSocket() {
		this._sock.onopen    = () => this.onOpen();
		this._sock.onmessage = (msg) => this._onMessage(msg);
		this._sock.onclose   = () => this.onClose();
	}

	/**
	 * Unsubscribe from the socket events
	 */
	private _disconnectSocket() {
		this._sock.onopen    = undefined;
		this._sock.onmessage = undefined;
		this._sock.onclose   = undefined;
	}

	/**
	 * Handle received messages
	 */
	private _onMessage(message: MessageEvent): any {
		this._ping = Date.now();
		if (message.data == "ping") {
			return;
		}
		this._handle(message.data);
	}

	/**
	 * Handle a received network event
	 */
	private _handle(message: string) {
		let context: any = this;
		let req = JSON.parse(message);
		let func = "on" + req['id'][0].toUpperCase() + req['id'].substr(1);
		if (func in context && context[func] instanceof Function) {
			context[func].apply(this, req['params'] || []);
		} else {
			console.warn(`[Network Event], WARNING: attempt to invoke unknown event '${req['id']}' in '${context.constructor.name}'`);
		}
	}

	// Methods -------------------------------------------------------------------------------------

	/**
	 * Close an open socket
	 */
	public close() {
		this._sock.close();
	}

	/**
	 * Create a new web socket and open a connection
	 */
	public open(host: string, port: number, secure?: boolean) {
		if (this._sock) {
			this._disconnectSocket();
		}
		this._sock = new WebSocket(`ws${secure ? 's' : ''}://${host}:${port}`);
		this._connectSocket();
	}

	/**
	 * Ping the socket
	 */
	public ping() {
		this._sock.send("ping");
	}

	// Accessors -----------------------------------------------------------------------------------

	/**
	 * Get the most recent ping timestamp
	 */
	public lastPing() {
		return this._ping;
	}

	/**
	 * Get the web socket
	 */
	public socket() {
		return this._sock;
	}

	// Mutators ------------------------------------------------------------------------------------

	/**
	 * Set the web socket
	 */
	protected setSocket(socket: WebSocket) {
		if (this._sock) {
			this._disconnectSocket();
		}
		this._sock = socket
		this._connectSocket();
	}
}
