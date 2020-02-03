<template>
	<button v-on:click="doNext">{{number}}</button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class extends Vue {
	@Prop() num: number;
}
</script>
