<template>
	<div :class="classStyle" @click="clicked">{{displayMsg}}</div>
</template>

<script>
export default {
	props: {
		displayMsg: String,
		classStyle: String
	},
	methods: {
		clicked() {
			this.$emit("btnClicked");
		}
	}
}
</script>

<style scoped>
div {
	padding: 0.5em 1em 0.5em 1em;
	border-radius: 5px;
	border-width: 1px;
	border-style: solid;
	transition: 0.2s;
	cursor: pointer;
}
.green {
	border-color: #4d908e;
}
.green:hover {
	border-color: #90be6d;
	background-color: #90be6d;
}
.yellow{
	border-color: #f9c74f;
}
.yellow:hover {
	background-color: #f9c74f;
}
.red {
	border-color: #f8961e;
}
.red:hover {
	border-color: #f9844a;
	background-color: #f9844a;
}
</style>
