const axios = require("axios");
const base64 = require("base-64");

exports.handler = async function (event, context) {
	try {
		const d = new Date();
		let time = d.getTime();
		let response = JSON.parse(event.body);
		var responseData = response.data;
		var folderName = response.folder_name;
		var data = JSON.stringify({
			"message": "created the file...",
			"content": base64.encode(JSON.stringify(responseData)),
		});

		let name = (responseData.first_name).replace(" ", "_");
		let fileName = name + time + ".json";

		var config = {
			method: 'put',
			url: 'https://api.github.com/repos/misusonu18/digital-visiting-card-js/contents/js/' + folderName + '/' + fileName,
			headers: {
				'Authorization': 'Bearer ' + process.env.TOKEN,
				'Content-Type': 'application/json',
			},
			data: data
		}

		var responseMessage;

		await axios(config)
			.then(function (testResponse) {
				responseMessage = testResponse;
			})
			.catch(function (error) {
				responseMessage = error;
			});

		return {
			statusCode: 201,
			body: JSON.stringify({
				msg: (responseMessage.data.content.name == fileName) ? "Successfull File Created" : "Something Went Wrong",
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