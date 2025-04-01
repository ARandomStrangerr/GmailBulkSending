<template>
<div class="flex column">
	<div :class="style">{{ displayMsg }}</div>
</div>
</template>

<style scoped>
.green {
	background-color: #d9ed92;
	border-color: #4d908e;
	border-style: solid;
	border-left-width: 2px;
}
</style>

<script>
export default {
	props: {
		displayMsg: String,
		style:String
	}
}
</script>
