<template>
	<div class="main-container invisible">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class extends Vue {
	//
}
</script>
