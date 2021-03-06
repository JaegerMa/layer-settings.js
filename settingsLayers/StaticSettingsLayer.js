'use strict';

const SettingsLayers = require(__dirname + '/SettingsLayer.js');

class StaticSettingsLayer extends SettingsLayers
{
	constructor(values)
	{
		super();
		this.values = values;
	}

	getValues()
	{
		return this.values || {};
	}
	getValuesSync()
	{
		return this.values || {};
	}
}

module.exports = StaticSettingsLayer;
