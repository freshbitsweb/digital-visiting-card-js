const axios = require("axios");
const base64 = require("base-64");

exports.handler = async function (event, context) {
	try {
		let response = JSON.parse(event.body);
		var responseData = response.data;
		var folderName = response.folder_name;
        var sha = response.sha;
        var fileName = response.file_name;
		var data = JSON.stringify({
			"message": "update the file...",
			"content": base64.encode(JSON.stringify(responseData)),
            "sha": sha
		});

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
				msg: (responseMessage.data.content.name == fileName) ? "Successfull File Updated" : "Something Went Wrong",
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