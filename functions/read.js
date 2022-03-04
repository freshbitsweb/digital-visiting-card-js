const axios = require("axios");
exports.handler = async function (event, context) {
	try {
		var config = {
			method: 'get',
			url: 'https://api.github.com/repos/misusonu18/digital-visiting-card-js/contents/js/json',
			headers: {
				'Authorization': 'Bearer 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',
				'Content-Type': 'application/json'
			}
		}

		return {
			statusCode: 200,
			body: JSON.stringify({
				data: await getData('Readme.md').then(function(result) {
                    console.log(result.content)
                }),
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