'use strict';

const fs = require('then-fs');
const isAccessible = require('is-accessible');

const SettingsLayers = require(__dirname + '/SettingsLayer.js');

class StaticSettingsLayer extends SettingsLayers
{
	constructor(path)
	{
		super();
		this.path = path;
	}

	async getValues()
	{
		if(!await isAccessible(this.path))
			return;

		let values = JSON.parse(fs.readFile(this.path));
		
		return values;
	}
	getValuesSync()
	{
		if(!isAccessible.sync(this.path))
			return;

		let values = JSON.parse(fs.readFileSync(this.path));

		return values;
	}
}

module.exports = StaticSettingsLayer;
