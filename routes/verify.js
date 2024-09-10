module.exports = {
	method: 'post',
	path: '/pass/verify',
	async exec(req, res) {
		let body;
		let userArr;
		let userData;

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

		for (let i = 0; i < userArr.length; i++) {
			const userData = (await globalThis.db.get(`user_${userArr[i]}`));

			//
		}
	}
}
