'use strict';

const fs = require('then-fs');
const path = require('path');
const merge = require('simple-merge');
const mkdirp = require('prm-mkdirp');

const SettingsLayer = require(__dirname + '/settingsLayers/SettingsLayer');
const StaticSettingsLayer = require(__dirname + '/settingsLayers/StaticSettingsLayer');
const FileSettingsLayer = require(__dirname + '/settingsLayers/FileSettingsLayer');

class Settings
{
	constructor(layers)
	{
		this.setLayers(layers || []);
	}

	addLayer(layer)
	{
		switch(typeof(layer))
		{
			case 'string':
				layer = new FileSettingsLayer(layer);
				break;
			case 'object':
				if(layer instanceof SettingsLayer)
					break;
				
				layer = new StaticSettingsLayer(layer);
				break;
			default:
				throw new Error('Layer must be a string or object');
		}

		this.layers.push(layer);
		this.clearCache();
	}
	setLayers(layers)
	{
		this.layers = layers;
		this.clearCache();
	}

	clearCache()
	{
		this.values = null;
	}

	async getValues()
	{
		if(this.values)
			return this.values;

		let values = {};
		for(let layer of this.layers)
		{
			let layerValues = await layer.getValues();
			if(!layerValues || typeof(layerValues) !== 'object' || Array.isArray(layerValues))
				continue;
			
			values = merge(values, layerValues);
		}
		Settings.normalizeObject(values);

		this.values = values;
		return values;
	}
	getValuesSync()
	{
		if(this.values)
			return this.values;

		let values = {};
		for(let layer of this.layers)
		{
			let layerValues = layer.getValuesSync();
			if(!layerValues || typeof(layerValues) !== 'object' || Array.isArray(layerValues))
				continue;
			
			values = merge(values, layerValues);
		}
		Settings.normalizeObject(values);

		this.values = values;
		return values;
	}

	async save(file)
	{
		let values = await this.getValues();
		let dir = path.dirname(Settings.configFilePath);

		await mkdirp(dir);
		let fileContent = JSON.stringify(values, null, '\t');

		return fs.writeFile(file, fileContent);
	}
	saveSync(file)
	{
		let values = this.getValuesSync();
		let dir = path.dirname(file);

		mkdirp.sync(dir);
		let fileContent = JSON.stringify(values, null, '\t');

		return fs.writeFileSync(file, fileContent);
	}


	//Replace all undefined-values with null to ensure
	//they can be saved in JSON
	static normalizeObject(obj)
	{
		for(let key in obj)
		{
			let val = obj[key];

			if(typeof(val) === 'object') 
			{
				if(!val || Array.isArray(val))
					return;
				
				Settings.normalizeObject(val);
				return;
			}

			if(val === undefined)
				obj[key] = null;
		}
	}
}


Settings.SettingsLayer = SettingsLayer;
Settings.StaticSettingsLayer = StaticSettingsLayer;
Settings.FileSettingsLayer = FileSettingsLayer;

module.exports = Settings;
