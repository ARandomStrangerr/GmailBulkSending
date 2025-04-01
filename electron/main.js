const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const excelOperaiton = require('./src/ExcelOperation');
const googleOperation = require('./src/GoogleMailOperaiton');
const property = require("./src/Property");

let mainWindow;
property.load();

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
			contextIsolation: true,
		}
  });
	//mainWindow.webContents.openDevTools();
	let vuePath = path.join(__dirname, ".." , "dist", 'index.html');
	mainWindow.loadFile(vuePath);		
});

ipcMain.handle("pickFile", async() => {
	const result = await dialog.showOpenDialog({
		properties: ["openFile"]
	});
	return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle("readExcel", async (event, excelFilePath) => {
	return excelOperaiton.read(excelFilePath);
});

ipcMain.handle("sendMailBridge", async (event, email, attachmentName) => {
	try {
		subject = property.get("mailSubject");
		body = property.get("mailBody");
		let attachmentFolder;
		if (path.isAbsolute(attachmentName)){
			attachmentFolder = path.dirname(attachmentName);
			attachmentName = path.basename(attachmentName);
		} else {
			attachmentFolder = property.get("attachmentFolder");
		}
		from = property.get('from');
		await googleOperation.sendMail(from, email, subject, body, attachmentFolder, attachmentName);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
});

ipcMain.handle("pickFolder", async () => {
	const result = await dialog.showOpenDialog({
		properties: ['openDirectory']
	});
	if (result.canceled) return null;
	property.set('attachmentFolder', result.filePaths[0]);
	property.save();
	return result.filePaths[0];
});

ipcMain.handle("getProperty", (event, key) => {
	val = property.get(key);
	return val;
});

ipcMain.handle("saveProperty", (event, key, value) => {
	property.set(key, value);
	property.save();
});
