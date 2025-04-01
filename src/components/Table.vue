<script setup>
import Btn from './Button.vue';
import Stt from './Status.vue';
import {mailList} from '../stores/counter';
</script>

<template>
	<div class='flex header centerlize'>
		<h2>List Of Receiver</h2>
		<div class='container bottom-margin'>
			<Btn displayMsg="Add" classStyle="green" @btnClicked="addBtnAction" />
			<Btn class="left-margin" displayMsg="Remove" classStyle="red" @btnClicked="rmvBtnAction" />
		</div>
	</div>
	<table>
		<tr>
			<th @clicked="changeCol1Val">{{col1}}</th>
			<th @clicked="changeCol2Val">{{col2}}</th>
			<th>Status</th>
		</tr>
	</table>
	<div class="grow table-body-wrapper">
		<table>
			<tbody>
				<tr v-for="(mail, i) in storage.list" :key="i" :class="selected.includes(i) ? 'selected' : ''">
					<th @click="changeMailAddress(mail)">
						<template v-if='mail["editCol1"]'>
							<input type="text" v-model="mail['col1']" @blur="mail['editCol1'] = false">
						</template>
						<template v-else > {{ mail["col1"] }} </template>
					</th>
					<th @click="changeAttachment(mail)">
						{{ mail['col2'] }}
					</th>
					<th @click="selectRow(i)"><Stt :displayMsg="mail['col3']" /></th>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {
	data() {
		return {
			col1: "mail",
			col2: "attachment",
			storage: mailList(),
			selected: []
		}
	},
	setup() {
	},
	methods: {
		async addBtnAction() {
			const excelPath = await window.electron.pickFile();
			if (!excelPath) return;
			const excelContent = await window.electron.readExcel(excelPath);
			for (let row of excelContent) {
				this.storage.add(row[this.col1], row[this.col2]);
			}
		},
		rmvBtnAction() {
			this.selected.sort((a, b) => b - a);
			for (let i of this.selected) this.storage.list.splice(i, 1);
			this.selected = [];
		},
		changeMailAddress(mail){
			mail['editCol1'] = true;
		},
		async changeAttachment(mail){
			const file = await window.electron.pickFile();
			if (file){
				mail['col2'] = file;
			}
		},
		selectRow(i){
			if (this.selected.includes(i)) {
				const index = this.selected.indexOf(i);
				if (index != -1) this.selected.splice(index, 1);
			} else this.selected.push(i);
		}
	}
}
</script>

<style scoped>
.container{
	display: flex;
}
.header {
	justify-content: space-between;
	align-items: center;
}
.table-body-wrapper {
	max-height: 350px;
	overflow-y: scroll;
}
table {
	width: 100%;
}
tr {
	border-style: solid;
	border-width: 0px 0px 1px 0px;
	border-color: #ced4da;
}
th {
	padding-top: 0.5em;
	padding-bottom: 0.5em;
	width: calc(100% / 3);
}
.selected {
	background-color: #edede9;
}
</style>
