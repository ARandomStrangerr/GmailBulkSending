const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
	pickFile: () => ipcRenderer.invoke("pickFile"),
	readExcel: (excelPath) => ipcRenderer.invoke("readExcel", excelPath),
	pickFolder: () => ipcRenderer.invoke("pickFolder"),
	sendMailBridge: (email, attachmentName) => ipcRenderer.invoke("sendMailBridge", email, attachmentName),
	getProperty: (key) => ipcRenderer.invoke("getProperty", key),
	saveProperty: (key, value) => ipcRenderer.invoke("saveProperty", key, value)
});
