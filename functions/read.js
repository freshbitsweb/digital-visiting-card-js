const axios = require("axios");
exports.handler = async function (event, context) {
	try {
		let response = null;
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
				data: getData('Readme.md').then(function(result) {
                    console.log(result);
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