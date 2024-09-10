const process = require('node:process');
const cluster = require('node:cluster');

const config = require('../config.json');

let workers = [];

function spawnPerformer(id) {
	process.stdout.write(`Spinning up performer ${id}\n`);
	const worker = cluster.fork();

	workers[id] = worker;

	worker.once('exit', async () => {
		process.stdout.write(`Performer ${id} died\n`);
		spawnPerformer(id);
	});
}

if (cluster.isPrimary) {
	for (let i = 0; i < config.main.performers; i++) {
		spawnPerformer(i);
	}
} else {
	require('./performer.js');
}
