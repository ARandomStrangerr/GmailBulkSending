const xlsx = require('xlsx');

function read(filePath) {
	const workbook = xlsx.readFile(filePath);
	const sheetName = workbook.SheetNames[0];
	const sheet = workbook.Sheets[sheetName];
	const data = xlsx.utils.sheet_to_json(sheet);
	return data;
}

module.exports = {
	read: read
};
