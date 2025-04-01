<template>
	<div :class="displayMsg">{{displayMsg}}</div>
</template>

<script>
export default {
	props: {
		displayMsg: String
	}
}
</script>

<style scoped>
div {
	border-radius: 1em;
	padding: 0.5em;
	border-style: solid;
	border-color: #edede9;
	border-width: 2px;
	position: relative;
	font-weight: 800;
}
div::before {
	border-radius: 50%;
	position: absolute;
	width: .5em;
	height: .5em;
	content: "";
	top:0.8em;
	left: 1em;
}
.pending {
	color: #f9c74f;
	border-color: #f9c74f;
	background-color: #faedcb;
}
.pending::before {
	background-color: #f9c74f;
}
.success {
	color: #43aa8b;
	border-color: #43aa8b;
	background-color: #d9ed92;
}
.success::before {
	background-color: #43aa8b;
}
.failure::before {
	background-color: #f94144;
}
.failure {
	color: #f94144;
	border-color: #f94144;
	background-color: #fae0e4;
}
</style>
