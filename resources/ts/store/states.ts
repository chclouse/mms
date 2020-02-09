import { Client } from "../client";

/**
 * The possible application states
 */
export enum MenuState {
	// Connection States
	Connecting,
	Disconnected,

	// Menu States
	RequestingUsername,

	// Game Status
	JoiningGame,
	InGame
}

/**
 * The possible game states
 */
export enum GameState {
	WaitingForPlayers,
	CountingDown,
	Running,
	Dead,
	Finished
}

/**
 * The root Vuex state
 */
export interface IRootState {
	connection: Client
}

/**
 * The menu Vuex state
 */
export interface IMenuState {
	menuState: MenuState
}

/**
 * The game Vuex state
 */
export interface IGameState {
	gameState: GameState,
	playerIndex: number,
	players: number[]
}
