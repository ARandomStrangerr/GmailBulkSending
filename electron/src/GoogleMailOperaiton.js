const property = require('./Property');
const { exec } = require('child_process');
const net = require('net');
const axios = require('axios');
const {readFileSync} = require('fs');
const path = require('path');

// doccumentation: https://developers.google.com/identity/protocols/oauth2/web-server#httprest_2

function openOAuth(){
	// step 1: set auth params
	queryStr = new URLSearchParams({
		'response_type': 'code',
		"client_id": property.get('clientId'),
		'redirect_uri': `http://localhost:${property.get('port')}`,	
		'scope': property.get('scope')
	}).toString();
	url = `https://accounts.google.com/o/oauth2/v2/auth?${queryStr}`;
	// step 2: redirect to Google Oauth Server
	exec(process.platform === 'win32' ? `start "${url}"` :
		process.platform === 'darwin' ? `open "${url}"` :
		`xdg-open "${url}"`);
}

async function getCode(){
	// step 3: capture the response from OAuth2.0
	return new Promise((resolve, rejects) => {
		const server = net.createServer((socket) => {
			let buffer = "";
			socket.once('data', (data) => {
				buffer = data.toString();
				socket.write("You now can close this window");
				socket.end();
			});
			socket.on('end', () => {
				if (buffer.includes("code")) server.close(() => resolve(buffer.split('\n')[0].split("&")[0].split('=')[1]));
				else server.close(() =>  rejects("Access Request has been declined"));
			})
		});
		server.listen(property.get('port'));
	});
}

async function exchageCode(code){
	// step 4: excahnge code for access token + refresh token
	return new Promise(async (resolve, rejects) => {
		response = await axios.post("https://oauth2.googleapis.com/token", {
			'client_id': property.get('clientId'),
			'client_secret': property.get('clientSecret'),
			'code': code,
			'grant_type': 'authorization_code',
			'redirect_uri': `http://localhost:${property.get('port')}`
		});
		resolve(response['data']);
	});
}

async function refreshAccessToken(){
	return new Promise(async (resolve, rejects) => {
		header = {
			"Content-Type": "application/x-www-form-urlencoded"
		};
		params = {
			'client_id': property.get('clientId'),
			'client_secret': property.get('clientSecret'),
			'refresh_token': property.get('refreshToken'),
			'grant_type': 'refresh_token',
		};
		response = await axios.post("https://oauth2.googleapis.com/token",{}, {headers: header, params: params });
		resolve(response['data']);
	});
}

async function authorization() {
	unix = Math.floor(Date.now()/1000);
	if (property.get('accessToken') == null
		|| unix > property.get("accessTokenExpiration")
			&& unix > property.get("refreshTokenExpiration")){
		openOAuth();
		code = await getCode();
		response = await exchageCode(code);
		property.set('accessToken', response['access_token']);
		property.set('accessTokenExpiration', unix + response['expires_in']);
		property.set('refreshToken', response['refresh_token']);
		property.set('refreshTokenExpiration', unix + response['refresh_token_expires_in']);
		property.save();
	} else if (unix > property.get("accessTokenExpiration")
		&& unix < property.get("refreshTokenExpiration")){
		response = await refreshAccessToken();
		property.set('accessToken', response['access_token']);
		property.set('refreshTokenExpiration', unix + response['refresh_token_expires_in']);
		property.set('accessTokenExpiration', unix + response['expires_in']);
		property.save();
	}
	return;
}

async function sendMail(from, to, subject, bodyMsg, attachmentFolder, attachmentName) {
	const boundary = "boo";
	const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
	let mimeMsg = `Content-Type: multipart/mixed; boundary=${boundary}\r\n` +
		`MIME-Version: 1.0\r\n` +
		`To: ${to}\r\n` +
		`From: ${from}\r\n` +
		`Subject: ${encodedSubject}\r\n\r\n` +
		`--${boundary}\r\n` +
		`Content-Type: text/plain; charset="UTF-8"\r\n` +
		`MIME-Version: 1.0\r\n` +
		`Content-Transfer-Encoding: 7bit\r\n\r\n` +
		`${bodyMsg}\r\n\r\n` 
	if (attachmentName){
		let attachmentBase64 = readFileSync(path.join(attachmentFolder, attachmentName)).toString('base64');
		mimeMsg += `--${boundary}\r\n` +
			`Content-Type: text/plain; name="${attachmentName}"\r\n` +
			`MIME-Version: 1.0\r\n` +
			`Content-Transfer-Encoding: base64\r\n` +
			`Content-Disposition: attachment; filename="${attachmentName}"\r\n\r\n` +
			`${attachmentBase64}\r\n\r\n`;
	}
	mimeMsg += `--${boundary}--`;
	await authorization();
	uri = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send'; 
	headers = {
		'Content-Type': 'application/json'
	};
	params = {
		"uploadType": "multipart",
		"access_token": property.get("accessToken")
	};
	mimeMsg = Buffer.from(mimeMsg).toString("base64");
	response = await axios.post(uri, { "raw": mimeMsg }, { params: params });
	return;
}

module.exports = {
	sendMail: sendMail
};
