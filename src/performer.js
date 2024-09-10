const path = require('node:path');
const fs = require('node:fs');

globalThis.config = require('../config.json');

const express = require('express');

const app = express();

globalThis.loadRoutes = () => {
	const routesDirectory = fs.readdirSync('./routes');

	for (let i = 0; i < routesDirectory.length; i++) {
		const routeFile = path.join(__dirname, '../routes', routesDirectory[i]);
		const routeModule = require(routeFile);

		if (typeof routeModule !== 'object') throw new TypeError('routeModule is not an object!');
		if (typeof routeModule.method !== 'string') throw new TypeError('routeModule.method is not a string!');
		if (typeof routeModule.path !== 'string') throw new TypeError('routeModule.path is not a string!');
		if (typeof routeModule.exec !== 'function') throw new TypeError('routeModule.method is not a function!');

		app[routeModule.method](routeModule.path, routeModule.exec);
	}

	return;
}

(async () => {
	globalThis.loadRoutes();
	app.listen(globalThis.config.performer.port);	
})();
