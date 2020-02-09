import { Module, ActionTree, GetterTree, MutationTree } from "vuex";
import { IRootState, IMenuState, MenuState } from "../states"

/**
 * The state
 */
export const state: IMenuState = {
	menuState: MenuState.Connecting
};

/**
 * Vuex getter functions
 */
export const getters: GetterTree<IMenuState, IRootState> = {
	//
};

/**
 * Vuex mutation functions
 */
export const mutations: MutationTree<IMenuState> = {
	changeMenuState(state, menuState: MenuState) {
		state.menuState = menuState;
	}
};

/**
 * Vuex actions
 */
export const actions: ActionTree<IMenuState, IRootState> = {
	//
};

/**
 * Complete Vuex Module
 */
export const menu: Module<IMenuState, IRootState> = {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
};
