<template>
	<div class="login">
		<form @submit="onSubmit">
			<div>
				<input class="invisible form-control error" type="text" id="username" ref="username" placeholder="Display Name">
			</div>
			<div>
				<button class="invisible btn btn-primary" ref="submit">Connect</button>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { State, Mutation } from "vuex-class";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import * as util from "../util";
import { MenuState, IMenuState } from "../store/states";
const namespace = "menu";

@Component
export default class extends Vue {
	@State("menu'") menu: IMenuState
	@Mutation("changeMenuState", { namespace }) changeMenuState: any;

	show() {
		util.animShow($(<any>this.$refs.username), "bounceIn");
		util.animShow($(<any>this.$refs.submit), "flipInX");
	}

	hide() {
		util.animHide($(<any>this.$refs.username), "bounceOut");
		util.animHide($(<any>this.$refs.submit), "flipOutX");
	}

	mounted() {
		//
	}

	onSubmit(e: Event) {
		this.changeMenuState(MenuState.RequestingUsername);
		util.anim(<any>this.$refs.username, "bounce");
		e.preventDefault();
	}

	@Watch('menu.menuState')
	onMenuStateChanged(state: MenuState, oldState: MenuState) {
		if (state == MenuState.RequestingUsername) {
			if (oldState != MenuState.RequestingUsername) {
				this.show();
			}
		} else {
			this.hide();
		}
	}
}
</script>
