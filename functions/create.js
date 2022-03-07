const axios = require("axios");
const btoa = require("btoa");
const { Octokit } = require("@octokit/core");

exports.handler = async function (event, context) {
	try {
		let data = event.body;
		
		const auth = new Octokit({ auth: `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` });

		let res = await auth.request('PUT /repos/{owner}/{repo}/contents/{path}', {
			owner: 'misusonu18',
			repo: 'digital-visiting-card-js',
			path: 'js/json/ff.json',
			message: 'message',
			content: btoa('hola')
		});

		console.log(res);

		return {
			statusCode: 201,
			body: JSON.stringify({
				msg: res
			}),
		};
	} catch (err) {
		return {
			statusCode: 404,
			body: JSON.stringify({
				msg: err.message,
			}),
		};
	}
};
