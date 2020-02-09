import { Module, ActionTree, GetterTree, MutationTree } from "vuex";
import { GameState, IRootState, IGameState } from "../states"

/**
 * The state
 */
export const state: IGameState = {
	gameState: GameState.WaitingForPlayers,
	playerIndex: -1,
	players: []
};

/**
 * Vuex getter functions
 */
export const getters: GetterTree<IGameState, IRootState> = {
	//
};

/**
 * Vuex mutation functions
 */
export const mutations: MutationTree<IGameState> = {
	changePlayerIndex(state, index: number) {
		state.playerIndex = index;
	}
};

/**
 * Vuex actions
 */
export const actions: ActionTree<IGameState, IRootState> = {
	//
};

/**
 * Complete Vuex Module
 */
export const minesweeper: Module<IGameState, IRootState> = {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
};
