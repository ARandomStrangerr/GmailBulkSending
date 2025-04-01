<script setup>
import TableComp from './components/Table.vue';
import BtnComp from './components/Button.vue';
import { mailList, attachmentFolderPath } from './stores/counter';
import { toRaw } from 'vue';
</script>

<template>
	<div id="app">
		<div class="flex column grow bottom-margin"><TableComp ref='tableComp'/></div>
		<div class="flex centerlize bottom-margin">
			Attachment Folder
			<input class="grow left-margin" type="text" placeholder="Path" v-model="folderPath.path" @click="pickFolder" readonly>
		</div>
		<div class="flex centerlize bottom-margin">
			Subject
			<input class="grow left-margin" type="text" placeholder="Subject" v-model="subject" @change="saveProperty($event, 'mailSubject')">
		</div>
		<div class="flex centerlize bottom-margin">
			From
			<input class="grow left-margin" type="text" placeholder="From" v-model="from" @change="saveProperty($event, 'from')">
		</div>
		<textarea class="bottom-margin" v-model="bodyMsg" cols="30" rows="10" @change="saveProperty($event, 'mailBody')"/>
		<BtnComp displayMsg='Send' @click="sendMail"/>
	</div>
</template>

<style scoped>
#app {
	width: 800px;
	height: 800px;
	background-color: white;
	display: flex;
	flex-direction: column;
	padding: 4em;
	box-sizing: border-box;
}
</style>

<style>
.bottom-margin {
	margin-bottom: 1em;
}
.left-margin {
	margin-left: 1em;
}
.grow {
	flex-grow: 1;
}
.flex {
	display: flex;
}
.column {
	flex-direction: column;
}
.row {
	flex-direction: row;
}
.centerlize {
	justify-content: center;
	align-content: center;
}
</style>

<script>
	export default {
		data() {
			return {
				folderPath: attachmentFolderPath(),
				bodyMsg: "",
				subject: "",
				from: ""
			}
		},
		async mounted() {
			this.bodyMsg = await window.electron.getProperty("mailBody");
			this.subject = await window.electron.getProperty("mailSubject");
			this.folderPath.path = await window.electron.getProperty("attachmentFolder");
			this.from = await window.electron.getProperty("from");
		},
		methods: {
			async sendMail() {
				let list = mailList();
				for (let index in list.list) {
					if (await window.electron.sendMailBridge(toRaw(list.list[index]['col1']), toRaw(list.list[index]['col2']), this.bodyMsg)) {
						list.changeStatus(index, "success");
					} else {
						list.changeStatus(index, "failure");
					}
				}
			},
			async pickFolder() {
				let path = await window.electron.pickFolder();
				if (path) {
					this.folderPath.path = path;
				}
			},
			saveProperty(event, key) {
				console.log(key);
				console.log(event.target.value);
				window.electron.saveProperty(key, event.target.value);
			}
		}
	}
</script>
