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
import { Vue, Component, Prop } from "vue-property-decorator";
import * as util from "../util";

@Component
export default class extends Vue {
	mounted() {
		util.animShow($(<any>this.$refs.username), "bounceIn");
		util.animShow($(<any>this.$refs.submit), "flipInX");
	}

	onSubmit(e: Event) {
		util.anim(<any>this.$refs.username, "bounce");
		e.preventDefault();
	}
}
</script>
