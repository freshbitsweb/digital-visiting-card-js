const axios = require("axios");
const btoa = require("btoa");
const { Octokit } = require("@octokit/core");

exports.handler = async function (event, context) {
	try {
		let responseData = JSON.parse(event.body);
		const date = new Date();
		let time = date.getTime();

		// let token = 'Bearer ' + responseData.token;

		let name = (responseData.data.first_name).replace(" ", "_");
		let fileName = name + time + ".json";
		const auth = new Octokit({ auth: `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` });

		let res = await auth.request('PUT /repos/{owner}/{repo}/contents/{path}', {
			owner: 'misusonu18',
			repo: 'digital-visiting-card-js',
			path: 'js/json/' + fileName,
			message: 'message',
			content: btoa(JSON.stringify(responseData.data))

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
