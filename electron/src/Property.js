const fs = require('fs');
const path = require('path');

let properties;

function load(propertyFilePath=path.join(".", "Property.json")){
	try {
		const data = fs.readFileSync(propertyFilePath);
		properties = JSON.parse(data);
	} catch {
		properties = {};
	}
}

function save(propertiesFilePath=path.join(".", "Property.json")){
	fs.writeFileSync(propertiesFilePath, JSON.stringify(properties, null, 4));
}

function get(key){
	return properties[key];
}

function set(key, value){
	properties[key] = value;
}

module.exports = {
	load : load,
	save : save,
	get : get,
	set : set
}
