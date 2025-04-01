import { defineStore } from 'pinia'

export const mailList = defineStore('mailList', {
	state: () => ({
		list: []
	}),
	actions: {
		add(email, path){
			this.list.push({col1: email, editCol1: false, col2: path, col3: 'pending'});
		},
		changeStatus(idx, stt){
			this.list[idx]['col3'] = stt;
		}	
	}
});

export const attachmentFolderPath = defineStore('attachmentFolder', {
	state: () => ({
		path: ""
	})
});
