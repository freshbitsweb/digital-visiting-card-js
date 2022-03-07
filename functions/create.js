const axios = require("axios");
const base64 = require("base-64");

exports.handler = async function (event, context) {
	try {
		var response;
		const d = new Date();
		let time = d.getTime();
		var data1 = JSON.parse(event.body);
		var data = JSON.stringify({
			"message": "created the file..." + time,
			"content": base64.encode(JSON.stringify(data1)),
		});

		let name = (data1.first_name).replace(" ", "_");
		let fileName = name + time + ".json";

		var config = {
			method: 'put',
			url: 'https://api.github.com/repos/misusonu18/digital-visiting-card-js/contents/js/json/' + fileName,
			headers: {
				'Authorization': 'Bearer' + process.env.TOKEN,
				'Content-Type': 'application/json'
			},
			data: data
		}
		console.log('testResponse');
		await axios(config)
			.then(function (testResponse) {
				console.log('testResponse');
				console.log(testResponse);
				return testResponse;
			})
			.catch(function (error) {
				console.log('error');
				console.log(error);
				return error;
			});

		return {
			statusCode: 201,
			body: JSON.stringify({
				msg: await axios(config)
			.then(function (testResponse) {
				console.log('testResponse');
				console.log(testResponse);
				response = testResponse;
			})
			.catch(function (error) {
				console.log('error');
				console.log(error);
				response = error;
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