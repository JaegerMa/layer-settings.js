# layer-settings
  Slim Settings-Manager on base of layers

```shell
npm install --save layer-settings
```

## Usage

```js
const Settings = require('layer-settings');

let settings = new Settings();

//Set default settings
settings.addLayer(
	{
		DEFAULT_SETTINGS
	}
);
//Add system settings
settings.addLayer('/etc/my-app/settings.json');
//Add user settings
settings.addLayer('~/.my-app/settings.json');
//Add command line parameters
settings.addLayers(args);

//Upper layers (added later) override values from lower layers
//Object values are merged recursive
//Arrays are overridden

//In this case first the static default settings,
//then the global settings in /etc
//then the user-specific settings in /home are read
//At the end the command line args are added


//(...)

let values = await settings.getValues();

//Do something with settings values

//(...)

await settings.save('~/.my-app/settings.json');
//Save settings modified by command line values
```

## Example

```js
const Settings = require('layer-settings');

let settings = new Settings();

//Set default settings
settings.addLayer(
	{
		a: 0,
		b: 1,
		c: [1, 2, 3],
		d:
		{
			a: 'A',
			b: []
		}
	}
);
//Add system settings
settings.addLayer('/etc/my-app/settings.json');
/* /etc/my-app/settings.json
{
	a: 42
}
*/

//Add user settings
settings.addLayer('~/.my-app/settings.json');
/* ~/.my-app/settings.json
{
	c: ['C'],
	d:
	{
		a: 'X',
		c: 1
	}
}
*/


//Add command line parameters
settings.addLayers(args);
/* Args
{
	a: 1337,
	b: undefined
}
*/

// (...)
let values = await settings.getValues();
/* values
{
	a: 1337, // from args
	b: 1, // from default settings, undefined values are ignored
	c: ['C'], // from user settings, arrays are overridden
	d: // objects are merged recursively
	{
		a: 'X', // from user settings
		b: [], // default settings
		c: 1 // from user settings
	}
}
*/
```

## API

### `Settings.addLayer(values)`
Add static layer
#### arguments
- `values: object, static values`

### `Settings.addLayer(path)`
Add file layer
#### arguments
- `path: string, settings file in JSON format`

### `Settings.addLayer(layer)`
Add raw layer-object inheriting from Settings.SettingsLayer
#### arguments
- `layer: Settings.SettingsLayer`

### `Settings.setLayers(layers)`
Set layer-stack containing raw layer-objects inheriting from Settings.SettingsLayer
#### arguments
- `layers: Settings.SettingsLayer[]`

### `Settings.clearCache()`
Clear cache. Called by Settings.addLayer and Settings.setLayers

### `Settings.getValues()`
Reads/Processes settings values async or serves them from cache
#### returns
- `Promise(settingsValues: object)`

### `Settings.getValuesSync()`
Reads/Processes settings values sync or serves them from cache
#### returns
- `settingsValues: object`

### `Settings.getRawValues()`
Returns the current loaded settings values, no matter whether they are loaded or not
#### returns
- `settingsValues: object`

### `Settings.isLoaded()`
Returns whether the settings are loaded
####
- `loaded: boolean`

### `Settings.save(path)`
Saves settings values as JSON file async
#### arguments
- `path: string, path to settings file to save to`
#### returns
- `Promise`

### `Settings.saveSync(path)`
Saves settings values as JSON file sync
#### arguments
- `path: string, path to settings file to save to`
