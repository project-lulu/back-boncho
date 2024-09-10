const argon2 = require('argon2');

module.exports = {
	method: 'post',
	path: '/pass/verify',
	async exec(req, res) {
		let body;
		let userArr;

		try {
			body = JSON.parse(req.body);
		} catch (e) {
			res.status(400).send(JSON.stringify({
				error: 1
			}));
			return;
		}

		if (
			typeof body?.username !== 'string' ||
			typeof body?.password !== 'string'
		) {
			res.status(400).send(JSON.stringify({
				error: 2
			}));
			return;
		}

		try {
			let _userArrReq;

			_userArrReq = await fetch(`http://${globalThis.config.performer.services.paradise.host}/${globalThis.config.performer.services.paradise.port}/users`);

			userArr = (await _userArrReq.json()).ids;
		} catch (e) {
			res.status(500).send(JSON.stringify({
				error: 3
			}));
			return;
		}

		let authed = 0;

		try {
			for (let i = 0; i < userArr.length; i++) {
				let req = await fetch(`http://${globalThis.config.performer.services.paradise.host}/${globalThis.config.performer.services.paradise.port}/user/${userArr[i]}`);
				let data = await req.json();
	
				if (data.payload.username === body.username) {
					if (await argon2.verify(data.payload.passhash, body.password)) {
						authed = 1;
					} else {
						authed = 0;
					}
					
					break;
				}
			}
		} catch (e) {
			res.status(500).send(JSON.stringify({
				error: 4
			}));
			return;
		}

		if (!authed) {
			res.status(401).send(JSON.stringify({
				error: 5
			}));

			return;
		} else {
			res.status(200).send(/* token */);

			return;
		}
	}
}
