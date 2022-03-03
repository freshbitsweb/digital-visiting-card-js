const axios = require("axios");
const btoa = require("btoa");
exports.handler = async function (event, context) {
	try {
		var response;
		const d = new Date();
		let time = d.getTime();
		var data1 = JSON.parse(event.body);
		var data = JSON.stringify({
			"message": "created the file...",
			"content": btoa(JSON.stringify(data1)),
		});

		let name = (data1.first_name).replace(" ", "_");
		let fileName = name + time + ".json";

		var config = {
			method: 'put',
			url: 'https://api.github.com/repos/misusonu18/digital-visiting-card-js/contents/js/json/' + fileName,
			headers: {
				'Authorization': 'Bearer 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',
				'Content-Type': 'application/json'
			},
			data: data
		}

		axios(config)
			.then(function (response) {
				response = response;
			})
			.catch(function (error) {
				response = error;
			});

		return {
			statusCode: 201,
			body: JSON.stringify({
				msg: response,
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